import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FC, ReactNode } from "react";
import { useNavigate } from "react-router";
import { setAuthConsumer } from "../../api";
import profiles from "../../api/profiles";
import type {
  AnyUser,
  UserRole,
  UnifiedLoginResponse,
} from "../../other/types";
import { AuthContext } from "./Authcontext";

const VALID_ROLES: readonly UserRole[] = ["customer", "admin", "staff"] as const;

const isValidRole = (value: string | null): value is UserRole =>
  value !== null && (VALID_ROLES as readonly string[]).includes(value);

// A Sanctum token is `<id>|<plaintext>`. Reject anything that doesn't
// at least have the expected shape — protects against DevTools-tampered
// garbage that would otherwise trigger a guaranteed 401 loop.
const isValidToken = (value: string | null): value is string =>
  typeof value === "string" && value.includes("|") && value.length >= 8;

const extractUser = (data: UnifiedLoginResponse | null): AnyUser | null => {
  if (!data) return null;
  return data.user ?? null;
};

const readInitialToken = (): string | null => {
  const raw = localStorage.getItem("token");
  return isValidToken(raw) ? raw : null;
};

const readInitialRole = (): UserRole | null => {
  const raw = localStorage.getItem("role");
  return isValidRole(raw) ? raw : null;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(readInitialToken);
  const [role, setRole] = useState<UserRole | null>(readInitialRole);
  const [user, setUser] = useState<AnyUser | null>(null);
  const [otherRoles, setOtherRoles] = useState<UserRole[]>([]);

  // Use a ref-based "already loaded once" flag so the rehydrate effect
  // doesn't run on every `user` state change.
  const rehydrated = useRef(false);

  const saveToken = useCallback((newToken: string | null) => {
    if (newToken && !isValidToken(newToken)) {
      // Don't accept malformed tokens.
      return;
    }
    setToken(newToken);
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
  }, []);

  const saveRole = useCallback((newRole: UserRole | null) => {
    if (newRole !== null && !isValidRole(newRole)) {
      return;
    }
    setRole(newRole);
    if (newRole) localStorage.setItem("role", newRole);
    else localStorage.removeItem("role");
  }, []);

  const handleLogout = useCallback(() => {
    saveToken(null);
    saveRole(null);
    setUser(null);
    setOtherRoles([]);
    rehydrated.current = false;
  }, [saveToken, saveRole]);

  const handleLoginSuccess = useCallback(
    (data: UnifiedLoginResponse) => {
      saveToken(data.token);
      saveRole(data.role);
      setUser(extractUser(data));
      setOtherRoles(data.other_roles ?? []);
    },
    [saveToken, saveRole],
  );

  const handleSwitchRole = useCallback(
    (data: UnifiedLoginResponse) => {
      saveToken(data.token);
      saveRole(data.role);
      setUser(extractUser(data));
      setOtherRoles(data.other_roles ?? []);
    },
    [saveToken, saveRole],
  );

  // Register an "onUnauthorized" callback so the axios interceptor can
  // clear local state atomically without dispatching window events.
  useEffect(() => {
    setAuthConsumer({
      onUnauthorized: () => {
        handleLogout();
        navigate("/login", { replace: true });
      },
    });
    return () => setAuthConsumer({});
  }, [handleLogout, navigate]);

  // Rehydrate the user object on hard refresh. We call the same
  // `profiles.get(role)` helper used everywhere else, so the response is
  // wrapped in `{ role, data }` and `data` resolves to the user model
  // (the old raw-fetch path received the unwrapped model and crashed on
  // `.data` accesses — see audit C1).
  useEffect(() => {
    if (!token || !role) {
      rehydrated.current = false;
      return;
    }
    if (rehydrated.current) return;
    rehydrated.current = true;

    let cancelled = false;
    profiles
      .get(role)
      .then((profile) => {
        if (!cancelled) setUser(profile.data);
      })
      .catch(() => {
        // The 401 interceptor's onUnauthorized will already have run
        // and cleared local state. Just reset the ref so a future login
        // can rehydrate again.
        rehydrated.current = false;
      });
    return () => {
      cancelled = true;
    };
  }, [token, role]);

  const value = useMemo(
    () => ({
      token,
      role,
      user,
      otherRoles,
      saveToken,
      saveRole,
      handleLoginSuccess,
      handleSwitchRole,
      handleLogout,
    }),
    [
      token,
      role,
      user,
      otherRoles,
      saveToken,
      saveRole,
      handleLoginSuccess,
      handleSwitchRole,
      handleLogout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

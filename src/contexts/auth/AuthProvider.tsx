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

  // Mirror token/role into refs so the rehydrate effect can detect
  // when its in-flight response targets a stale pair (e.g. a fast
  // role-switch resolved before a previous role's profile fetch).
  const tokenRef = useRef(token);
  const roleRef = useRef(role);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

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
      // Trust the unified-login response's user payload — it already
      // includes the new role's profile. Setting `user` directly avoids
      // a redundant network round-trip and any race against the
      // rehydrate effect's "already-loaded" guard.
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

  // Rehydrate the user object on hard refresh OR when the token/role
  // changes (e.g. after a successful switch-role). We use ref-mirrors
  // to detect stale responses: if the latest token/role no longer match
  // the snapshot this fetch started with, the response is dropped.
  useEffect(() => {
    if (!token || !role) return;

    const snapshotToken = token;
    const snapshotRole = role;
    let cancelled = false;

    profiles
      .get(role)
      .then((profile) => {
        // Drop stale responses: if the token/role has changed since
        // this fetch was issued, ignore the result so the UI doesn't
        // briefly flash the previous role's profile.
        if (cancelled) return;
        if (tokenRef.current !== snapshotToken || roleRef.current !== snapshotRole) return;
        setUser(profile.data);
      })
      // The 401 interceptor's onUnauthorized will already have run and
      // cleared local state. Nothing else to do here.
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [token, role]);

  // Derive the exposed user: when there's no token/role, force null
  // regardless of what's in `user`. This avoids a setState-in-effect
  // and keeps logout semantics crisp.
  const effectiveUser: AnyUser | null = token && role ? user : null;

  const value = useMemo(
    () => ({
      token,
      role,
      user: effectiveUser,
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
      effectiveUser,
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
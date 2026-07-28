import { useEffect, useMemo, useRef, useState } from "react";
import type { FC, ReactNode } from "react";
import type {
  AnyUser,
  UserRole,
  UnifiedLoginResponse,
  AnyProfileResponse,
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

const profileDataToUser = (profile: AnyProfileResponse | null): AnyUser | null => {
  if (!profile) return null;
  return profile.data;
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
  const [token, setToken] = useState<string | null>(readInitialToken);
  const [role, setRole] = useState<UserRole | null>(readInitialRole);
  const [user, setUser] = useState<AnyUser | null>(null);
  const [otherRoles, setOtherRoles] = useState<UserRole[]>([]);

  // Use a ref-based "already loaded once" flag so the rehydrate effect
  // doesn't run on every `user` state change (it previously had `user`
  // in the dep array, causing a refetch loop on certain profile updates).
  const rehydrated = useRef(false);

  const saveToken = (newToken: string | null) => {
    if (newToken && !isValidToken(newToken)) {
      // Don't accept malformed tokens.
      return;
    }
    setToken(newToken);
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
  };

  const saveRole = (newRole: UserRole | null) => {
    if (newRole !== null && !isValidRole(newRole)) {
      return;
    }
    setRole(newRole);
    if (newRole) localStorage.setItem("role", newRole);
    else localStorage.removeItem("role");
  };

  const handleLoginSuccess = (data: UnifiedLoginResponse) => {
    saveToken(data.token);
    saveRole(data.role);
    setUser(extractUser(data));
    setOtherRoles(data.other_roles ?? []);
  };

  const handleSwitchRole = (data: UnifiedLoginResponse) => {
    saveToken(data.token);
    saveRole(data.role);
    setUser(extractUser(data));
    setOtherRoles(data.other_roles ?? []);
  };

  const handleLogout = () => {
    saveToken(null);
    saveRole(null);
    setUser(null);
    setOtherRoles([]);
    rehydrated.current = false;
  };

  // Listen for the logout event dispatched by the axios interceptor when
  // a 401 is detected, so the local state stays in sync without the
  // interceptor needing a direct dependency on this provider.
  useEffect(() => {
    const onAuthLogout = () => handleLogout();
    window.addEventListener("auth:logout", onAuthLogout);
    return () => window.removeEventListener("auth:logout", onAuthLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rehydrate the user object on hard refresh. The deps are intentionally
  // [token, role] only — `user` is excluded so subsequent renders don't
  // refetch. The ref guard ensures we only do this once per token+role.
  useEffect(() => {
    if (!token || !role) {
      rehydrated.current = false;
      return;
    }
    if (rehydrated.current) return;
    rehydrated.current = true;

    let cancelled = false;
    const apiBase =
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
      "http://appointment_module_backend.test/api";
    fetch(`${apiBase}/${role}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: AnyProfileResponse) => {
        if (!cancelled) setUser(profileDataToUser(data));
      })
      .catch(() => {
        // The 401 interceptor will dispatch auth:logout; nothing else
        // to do here.
        rehydrated.current = false;
      });
    return () => {
      cancelled = true;
    };
  }, [token, role]);

  // Memoize the context value so consumers don't re-render on every
  // parent state change.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, role, user, otherRoles],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

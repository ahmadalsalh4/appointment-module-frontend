import { useEffect, useState } from "react";
import type { FC, ReactNode } from "react";
import type { AnyUser, UserRole, UnifiedLoginResponse, AnyProfileResponse } from "../../other/types";
import { AuthContext } from "./Authcontext";

const extractUser = (data: UnifiedLoginResponse | null): AnyUser | null => {
  if (!data) return null;
  return data.user ?? null;
};

const profileDataToUser = (profile: AnyProfileResponse | null): AnyUser | null => {
  if (!profile) return null;
  return profile.data;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<UserRole | null>(localStorage.getItem("role") as UserRole | null);
  const [user, setUser] = useState<AnyUser | null>(null);
  const [otherRoles, setOtherRoles] = useState<UserRole[]>([]);

  const saveToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
  };

  const saveRole = (newRole: UserRole | null) => {
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
  };

  // Restore the user object on hard refresh: token + role are persisted in
  // localStorage, but the user object isn't. Fetch the profile once on mount
  // so pages that rely on useAuth().user (e.g. BookAppointmentPage summary)
  // have it immediately.
  useEffect(() => {
    if (!token || !role || user) return;
    let cancelled = false;
    const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)
      || "http://appointment_module_backend.test/api";
    fetch(`${apiBase}/${role}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: AnyProfileResponse) => {
        if (!cancelled) setUser(profileDataToUser(data));
      })
      .catch(() => {
        // Token may be expired; the 401 interceptor will redirect to /login.
      });
    return () => {
      cancelled = true;
    };
  }, [token, role, user]);

  return (
    <AuthContext.Provider
      value={{ token, role, user, otherRoles, saveToken, saveRole, handleLoginSuccess, handleSwitchRole, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

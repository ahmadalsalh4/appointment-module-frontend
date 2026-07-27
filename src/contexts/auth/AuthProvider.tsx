import { useState } from "react";
import type { AnyUser, UserRole, UnifiedLoginResponse } from "../../other/types";
import { AuthContext } from "./Authcontext";

const extractUser = (data: UnifiedLoginResponse | null): AnyUser | null => {
  if (!data) return null;
  return data.user ?? null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    setOtherRoles([]);
  };

  const handleLogout = () => {
    saveToken(null);
    saveRole(null);
    setUser(null);
    setOtherRoles([]);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, user, otherRoles, saveToken, saveRole, handleLoginSuccess, handleSwitchRole, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

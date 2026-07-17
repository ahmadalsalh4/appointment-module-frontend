import { useState, type ReactNode } from "react";
import { AuthContext, type Role } from "./Authcontext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userRole, setUserRole] = useState<Role>(() => {
    const storedRole = localStorage.getItem("userRole");
    return (storedRole as Role) || null;
  });

  const login = (role: Role) => {
    localStorage.setItem("userRole", role as string);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

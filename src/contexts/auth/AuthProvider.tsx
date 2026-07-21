import { useState, type ReactNode } from "react";
import { AuthContext } from "./Authcontext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [role, setRole] = useState<string | null>(() => {
    return localStorage.getItem("role");
  });

  const saveToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  const saveRole = (newRole: string | null) => {
    if (newRole) {
      localStorage.setItem("role", newRole);
    } else {
      localStorage.removeItem("role");
    }
    setRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        saveToken,
        saveRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { useState, type ReactNode } from "react";
import type { Role } from "../other/types";
import { AuthContext, type LoginResult } from "./Authcontext";

const BASE_URL = "http://localhost:8000/api";

const LOGIN_ENDPOINTS: Record<Role, string> = {
  customer: "/customer/login",
  staff: "/staff/login",
  admin: "/admin/login",
};

interface StoredAuth {
  role: Role;
  token: string;
}

const STORAGE_KEY = "auth";

function readStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [stored, setStored] = useState<StoredAuth | null>(() =>
    readStoredAuth(),
  );

  const login = async (
    email: string,
    password: string,
    role: Role,
  ): Promise<LoginResult> => {
    try {
      const response = await fetch(`${BASE_URL}${LOGIN_ENDPOINTS[role]}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data?.message ?? "Giriş başarısız" };
      }

      const authData: StoredAuth = { role, token: data.token };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
      setStored(authData);

      return { success: true };
    } catch {
      return { success: false, message: "Sunucuya ulaşılamadı" };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStored(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userRole: stored?.role ?? null,
        token: stored?.token ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

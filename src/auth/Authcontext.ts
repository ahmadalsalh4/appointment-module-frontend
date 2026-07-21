import { createContext } from "react";
import type { Role } from "../other/types";

export interface LoginResult {
  success: boolean;
  message?: string;
}

export interface AuthContextValue {
  userRole: Role | null;
  token: string | null;
  login: (email: string, password: string, role: Role) => Promise<LoginResult>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

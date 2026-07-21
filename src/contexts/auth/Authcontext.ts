import { createContext } from "react";

export interface AuthContextValue {
  token: string | null;
  role: string | null;
  saveToken: (token: string | null) => void;
  saveRole: (role: string | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

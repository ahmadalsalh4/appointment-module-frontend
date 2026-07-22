import { createContext } from "react";
import type { Role } from "../../other/types";

export interface AuthContextValue {
  token: string | null;
  role: Role | null;
  saveToken: (token: string | null) => void;
  saveRole: (role: Role | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

import { createContext } from "react";

export type Role = "user" | "admin" | null;

export interface AuthContextType {
  userRole: Role;
  login: (role: Role) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

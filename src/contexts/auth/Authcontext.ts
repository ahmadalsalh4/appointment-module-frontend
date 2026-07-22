import { createContext } from "react";
import type { AuthContextValue } from "../../other/types";


export const AuthContext = createContext<AuthContextValue | null>(null);

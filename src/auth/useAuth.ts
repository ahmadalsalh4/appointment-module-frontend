import { useContext } from "react";
import { AuthContext } from "./Authcontext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth hook'u AuthProvider içinde kullanılmalıdır!");
  }
  return context;
};

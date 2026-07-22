import { useContext } from "react";
import { AuthContext } from "./Authcontext";

export const useAuthCTX = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth hook'u AuthProvider içinde kullanılmalıdır!");
  }

  return context;
};

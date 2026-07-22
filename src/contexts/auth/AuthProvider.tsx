import { useState } from "react";
import type { AnyAuthResponse, AnyUser, UserRole } from "../../other/types";
import { AuthContext } from "./Authcontext";

// Helper to safely extract the user profile from the crazy union shape
const extractUser = (authData: AnyAuthResponse | null): AnyUser | null => {
  if (!authData) return null;

  switch (authData.role) {
    case "customer":
      return authData.customer;
    case "admin":
      return authData.admin;
    case "staff":
      return authData.staff;
    default:
      return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [role, setRole] = useState<UserRole | null>(
    localStorage.getItem("role") as UserRole | null,
  );

  // We store the parsed user data here so we don't have to keep extracting it
  const [user, setUser] = useState<AnyUser | null>(null);

  // On mount, if there's a token, you might want to fetch the profile to hydrate `user`
  // For now, we will set it upon login.

  const saveToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
  };

  const saveRole = (newRole: UserRole | null) => {
    setRole(newRole);
    if (newRole) localStorage.setItem("role", newRole);
    else localStorage.removeItem("role");
  };

  // Custom function to call after successful login/register
  const handleLoginSuccess = (data: AnyAuthResponse) => {
    saveToken(data.token);
    saveRole(data.role);
    setUser(extractUser(data));
  };

  // Custom function to call on logout
  const handleLogout = () => {
    // saveToken(null);
    // saveRole(null);
    // setUser(null);
    // window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        saveToken,
        saveRole,
        handleLoginSuccess,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context easily

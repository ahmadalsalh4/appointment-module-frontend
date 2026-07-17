import { Navigate, useLocation } from "react-router";
import { useAuth } from "./useAuth";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { userRole } = useAuth();
  const location = useLocation();

  if (!userRole) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/yetkisiz" replace />;
  }

  return children;
};

export default ProtectedRoute;

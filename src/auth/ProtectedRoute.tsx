import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./useAuth";
import type { Role } from "../other/types";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { userRole, token } = useAuth();
  const location = useLocation();

  if (!token || !userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

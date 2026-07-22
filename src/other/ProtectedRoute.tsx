import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/auth/useAuth";
import type { UserRole } from "./types";

interface ProtectedRouteProps {
  allowedRole: UserRole;
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { token, role } = useAuth();

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

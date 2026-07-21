import { Navigate, Outlet } from "react-router";
import type { Role } from "./types";
import { useAuth } from "../contexts/auth/useAuth";

interface ProtectedRouteProps {
  allowedRole: Role;
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

import { Navigate, Outlet } from "react-router";
import type { Role } from "./typesold";
import { useAuthCTX } from "../contexts/auth/useAuthCTX";

interface ProtectedRouteProps {
  allowedRole: Role;
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { token, role } = useAuthCTX();

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

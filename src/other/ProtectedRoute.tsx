import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/auth/useAuth";
import type { UserRole } from "./types";

interface ProtectedRouteProps {
  allowedRole: UserRole;
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { token, role, user } = useAuth();

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // While rehydration is in progress, render nothing (no flash of
  // protected content with a null user). BookAppointmentPage depends
  // on `user` and would otherwise briefly show
  // "İletişim bilgileri yüklenemedi".
  if (token && role && user === null) {
    return null;
  }

  return <Outlet />;
}

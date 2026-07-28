import type { UserRole } from "../other/types";

/**
 * Single source of truth for "where do I send this user after login?".
 * Previously the same role→path mapping was duplicated in
 * Login.tsx, Register.tsx, NotFoundPage.tsx, UnauthorizedPage.tsx,
 * Header.tsx, Sidebar.tsx and SwitchRoleDialog.tsx. Each copy could
 * (and did) drift.
 */
export const ROLE_HOME: Record<UserRole, string> = {
  customer: "/",
  staff: "/staff",
  admin: "/admin",
};

export const ROLE_PROFILE: Record<UserRole, string> = {
  customer: "/profile",
  staff: "/staff/profile",
  admin: "/admin/profile",
};

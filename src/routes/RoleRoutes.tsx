import { Route } from "react-router";
import type { ReactNode, ComponentType } from "react";
import ProtectedRoute from "../other/ProtectedRoute";
import type { UserRole } from "../other/types";

type RouteConfig = { path: string; element: ReactNode };

export default function RoleRoutes({
  allowedRole,
  layout: Layout,
  routes,
}: {
  allowedRole: UserRole;
  layout: ComponentType;
  routes: RouteConfig[];
}) {
  return (
    <Route element={<ProtectedRoute allowedRole={allowedRole} />}>
      <Route element={<Layout />}>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Route>
  );
}

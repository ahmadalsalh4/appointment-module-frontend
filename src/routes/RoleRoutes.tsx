import { Route } from "react-router";
import ProtectedRoute from "../other/ProtectedRoute";
import type { Role } from "../other/typesold";

type RouteConfig = { path: string; element: React.ReactNode };

export default function RoleRoutes({
  allowedRole,
  layout: Layout,
  routes,
}: {
  allowedRole: Role;
  layout: React.ComponentType;
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

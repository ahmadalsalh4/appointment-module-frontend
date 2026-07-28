import { Fragment } from "react";
import { Route } from "react-router";
import type { ReactNode, ComponentType } from "react";
import ProtectedRoute from "../other/ProtectedRoute";
import type { UserRole } from "../other/types";

type RouteConfig = { path: string; element: ReactNode };

/**
 * Builds a fragment of <Route> elements for a role-protected area.
 *
 * NOTE: This must be invoked as a FUNCTION (not rendered as a JSX component)
 * inside <Routes>. React Router v8 only accepts <Route> or <React.Fragment>
 * as direct children of <Routes>; if RoleRoutes were rendered as
 * <RoleRoutes />, the returned fragment would be wrapped in a
 * function-component instance, which <Routes> cannot recognise as a Route
 * child ("[vl] is not a <Route> component").
 */
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
    <Fragment>
      <Route element={<ProtectedRoute allowedRole={allowedRole} />}>
        <Route element={<Layout />}>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>
    </Fragment>
  );
}

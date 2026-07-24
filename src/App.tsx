import { Route, Routes } from "react-router";
import GeneralLayout from "./pages/layouts/GeneralLayout";
import CustomerLayout from "./pages/layouts/CustomerLayout";
import StaffLayout from "./pages/layouts/StaffLayout";
import AdminLayout from "./pages/layouts/AdminLayout";

import RoleRoutes from "./routes/RoleRoutes";
import { customerRoutes } from "./routes/customerRoutes";
import { staffRoutes } from "./routes/staffRoutes";
import { adminRoutes } from "./routes/adminRoutes";

import Login from "./pages/shared/Login";
import Register from "./pages/shared/Register";
import UnauthorizedPage from "./pages/shared/UnauthorizedPage";
import NotFoundPage from "./pages/shared/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<GeneralLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {RoleRoutes({
          allowedRole: "customer",
          layout: CustomerLayout,
          routes: customerRoutes,
        })}
        {RoleRoutes({
          allowedRole: "staff",
          layout: StaffLayout,
          routes: staffRoutes,
        })}
        {RoleRoutes({
          allowedRole: "admin",
          layout: AdminLayout,
          routes: adminRoutes,
        })}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

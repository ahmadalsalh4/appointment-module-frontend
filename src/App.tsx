import { Navigate, Route, Routes } from "react-router";
import UnauthorizedPage from "./pages/shared/UnauthorizedPage";
import ServicesPage from "./pages/customer/ServicesPage";
import ServiceDetailPage from "./pages/customer/ServiceDetailPage";
import MyAppointmentsPage from "./pages/customer/MyAppointmentsPage";
import MyAppointmentDetailPage from "./pages/customer/MyAppointmentDetailPage";
import StaffAppointmentsPage from "./pages/staff/StaffAppointmentsPage";

import NotFoundPage from "./pages/shared/NotFoundPage";
import AdminServicesList from "./pages/admin/services/AdminServicesList";
import AdminServiceAdd from "./pages/admin/services/AdminServiceAdd";
import AdminServiceDetail from "./pages/admin/services/AdminServiceDetail";
import AdminServiceEdit from "./pages/admin/services/AdminServiceEdit";
import AdminCategoriesList from "./pages/admin/categories/AdminCategoriesList";
import AdminCategoryAdd from "./pages/admin/categories/AdminCategoryAdd";
import AdminCategoryDetail from "./pages/admin/categories/AdminCategoryDetail";
import AdminCategoryEdit from "./pages/admin/categories/AdminCategoryEdit";
import AdminStaffList from "./pages/admin/staff/AdminStaffList";
import AdminStaffAdd from "./pages/admin/staff/AdminStaffAdd";
import AdminStaffDetail from "./pages/admin/staff/AdminStaffDetail";
import AdminStaffEdit from "./pages/admin/staff/AdminStaffEdit";
import CustomerLayout from "./pages/layouts/CustomerLayout";
import StaffLayout from "./pages/layouts/StaffLayout";
import AdminLayout from "./pages/layouts/AdminLayout";
import ProtectedRoute from "./other/ProtectedRoute";
import Login from "./pages/shared/Login";
import Register from "./pages/shared/Register";
import GeneralLayout from "./pages/layouts/GeneralLayout";
import ProfilePage from "./pages/shared/ProfilePage";
import StaffAppointmentDetailPage from "./pages/staff/StaffAppointmentDetailPage";

export default function App() {
  return (
    <Routes>
      {/* Wrap EVERYTHING in GeneralLayout so Header/Footer always show */}
      <Route element={<GeneralLayout />}>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* --- CUSTOMER ROUTES --- */}
        <Route element={<ProtectedRoute allowedRole="customer" />}>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<ServicesPage />} />
            <Route path="/customer/profile" element={<ProfilePage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/my-appointments" element={<MyAppointmentsPage />} />
            <Route
              path="/my-appointments/:id"
              element={<MyAppointmentDetailPage />}
            />
          </Route>
        </Route>

        {/* Inside Staff Routes */}
        <Route element={<ProtectedRoute allowedRole="staff" />}>
          <Route element={<StaffLayout />}>
            <Route
              path="/staff"
              element={<Navigate to="/staff/appointments" replace />}
            />
            <Route
              path="/staff/appointments"
              element={<StaffAppointmentsPage />}
            />
            <Route
              path="/staff/appointments/:id"
              element={<StaffAppointmentDetailPage />}
            />{" "}
            {/* BUNU EKLE */}
            <Route path="/staff/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* --- ADMIN ROUTES --- */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route element={<AdminLayout />}>
            {/* Changed this from AdminProfilePage to a Navigate redirect to match your sidebar structure */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/services" replace />}
            />
            <Route path="/admin/profile" element={<ProfilePage />} />

            {/* Services */}
            <Route path="/admin/services" element={<AdminServicesList />} />
            <Route path="/admin/services/add" element={<AdminServiceAdd />} />
            <Route
              path="/admin/services/:id"
              element={<AdminServiceDetail />}
            />
            <Route
              path="/admin/services/:id/edit"
              element={<AdminServiceEdit />}
            />

            {/* Categories */}
            <Route path="/admin/categories" element={<AdminCategoriesList />} />
            <Route
              path="/admin/categories/add"
              element={<AdminCategoryAdd />}
            />
            <Route
              path="/admin/categories/:id"
              element={<AdminCategoryDetail />}
            />
            <Route
              path="/admin/categories/:id/edit"
              element={<AdminCategoryEdit />}
            />

            {/* Staff */}
            <Route path="/admin/staff" element={<AdminStaffList />} />
            <Route path="/admin/staff/add" element={<AdminStaffAdd />} />
            <Route path="/admin/staff/:id" element={<AdminStaffDetail />} />
            <Route path="/admin/staff/:id/edit" element={<AdminStaffEdit />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

// ==========================================
// PAGES: SHARED
// ==========================================
import ProfilePage from "../pages/shared/ProfilePage";

// ==========================================
// PAGES: ADMIN DASHBOARD
// ==========================================
import AdminHomePage from "../pages/admin/AdminHomePage";
import AdminAppointmentsList from "../pages/admin/AdminAppointmentsList";
import AdminAppointmentDetail from "../pages/admin/AdminAppointmentDetail";

// ==========================================
// PAGES: ADMIN SERVICES
// ==========================================
import AdminServicesList from "../pages/admin/services/AdminServicesList";
import AdminServiceAdd from "../pages/admin/services/AdminServiceAdd";
import AdminServiceDetail from "../pages/admin/services/AdminServiceDetail";
import AdminServiceEdit from "../pages/admin/services/AdminServiceEdit";

// ==========================================
// PAGES: ADMIN CATEGORIES
// ==========================================
import AdminCategoriesList from "../pages/admin/categories/AdminCategoriesList";
import AdminCategoryAdd from "../pages/admin/categories/AdminCategoryAdd";
import AdminCategoryDetail from "../pages/admin/categories/AdminCategoryDetail";
import AdminCategoryEdit from "../pages/admin/categories/AdminCategoryEdit";

// ==========================================
// PAGES: ADMIN STAFF
// ==========================================
import AdminStaffList from "../pages/admin/staff/AdminStaffList";
import AdminStaffAdd from "../pages/admin/staff/AdminStaffAdd";
import AdminStaffDetail from "../pages/admin/staff/AdminStaffDetail";
import AdminStaffEdit from "../pages/admin/staff/AdminStaffEdit";

// ==========================================
// ROUTES DEFINITION
// ==========================================
export const adminRoutes = [
  // Dashboard & Shared
  { path: "/admin", element: <AdminHomePage /> },
  { path: "/admin/profile", element: <ProfilePage /> },

  // Appointments
  { path: "/admin/appointments", element: <AdminAppointmentsList /> },
  { path: "/admin/appointments/:id", element: <AdminAppointmentDetail /> },

  // Services
  { path: "/admin/services", element: <AdminServicesList /> },
  { path: "/admin/services/add", element: <AdminServiceAdd /> },
  { path: "/admin/services/:id", element: <AdminServiceDetail /> },
  { path: "/admin/services/:id/edit", element: <AdminServiceEdit /> },

  // Categories
  { path: "/admin/categories", element: <AdminCategoriesList /> },
  { path: "/admin/categories/add", element: <AdminCategoryAdd /> },
  { path: "/admin/categories/:id", element: <AdminCategoryDetail /> },
  { path: "/admin/categories/:id/edit", element: <AdminCategoryEdit /> },

  // Staff
  { path: "/admin/staff", element: <AdminStaffList /> },
  { path: "/admin/staff/add", element: <AdminStaffAdd /> },
  { path: "/admin/staff/:id", element: <AdminStaffDetail /> },
  { path: "/admin/staff/:id/edit", element: <AdminStaffEdit /> },
];

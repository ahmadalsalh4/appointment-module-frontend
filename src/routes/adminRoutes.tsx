import AdminServicesList from "../pages/admin/services/AdminServicesList";
import AdminServiceAdd from "../pages/admin/services/AdminServiceAdd";
import AdminServiceDetail from "../pages/admin/services/AdminServiceDetail";
import AdminServiceEdit from "../pages/admin/services/AdminServiceEdit";
import AdminCategoriesList from "../pages/admin/categories/AdminCategoriesList";
import AdminCategoryAdd from "../pages/admin/categories/AdminCategoryAdd";
import AdminCategoryDetail from "../pages/admin/categories/AdminCategoryDetail";
import AdminCategoryEdit from "../pages/admin/categories/AdminCategoryEdit";
import AdminStaffList from "../pages/admin/staff/AdminStaffList";
import AdminStaffAdd from "../pages/admin/staff/AdminStaffAdd";
import AdminStaffDetail from "../pages/admin/staff/AdminStaffDetail";
import AdminStaffEdit from "../pages/admin/staff/AdminStaffEdit";
import ProfilePage from "../pages/shared/ProfilePage";
import AdminHomePage from "../pages/admin/AdminHomePage";

export const adminRoutes = [
  { path: "/admin", element: <AdminHomePage /> },

  { path: "/admin/profile", element: <ProfilePage /> },

  { path: "/admin/services", element: <AdminServicesList /> },
  { path: "/admin/services/add", element: <AdminServiceAdd /> },
  { path: "/admin/services/:id", element: <AdminServiceDetail /> },
  { path: "/admin/services/:id/edit", element: <AdminServiceEdit /> },

  { path: "/admin/categories", element: <AdminCategoriesList /> },
  { path: "/admin/categories/add", element: <AdminCategoryAdd /> },
  { path: "/admin/categories/:id", element: <AdminCategoryDetail /> },
  { path: "/admin/categories/:id/edit", element: <AdminCategoryEdit /> },

  { path: "/admin/staff", element: <AdminStaffList /> },
  { path: "/admin/staff/add", element: <AdminStaffAdd /> },
  { path: "/admin/staff/:id", element: <AdminStaffDetail /> },
  { path: "/admin/staff/:id/edit", element: <AdminStaffEdit /> },
];

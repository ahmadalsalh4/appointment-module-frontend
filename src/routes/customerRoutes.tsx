import MyAppointmentsPage from "../pages/customer/MyAppointmentsPage";
import MyAppointmentDetailPage from "../pages/customer/MyAppointmentDetailPage";
import ProfilePage from "../pages/shared/ProfilePage";

export const customerRoutes = [
  { path: "/", element: <MyAppointmentsPage /> }, // Changed "/" to appointments as the customer homepage
  { path: "/profile", element: <ProfilePage /> },
  { path: "/appointments", element: <MyAppointmentsPage /> },
  { path: "/appointments/:id", element: <MyAppointmentDetailPage /> },
];

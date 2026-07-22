import ServicesPage from "../pages/customer/ServicesPage";
import ServiceDetailPage from "../pages/customer/ServiceDetailPage";
import MyAppointmentsPage from "../pages/customer/MyAppointmentsPage";
import MyAppointmentDetailPage from "../pages/customer/MyAppointmentDetailPage";
import ProfilePage from "../pages/shared/ProfilePage";

export const customerRoutes = [
  { path: "/", element: <ServicesPage /> },

  { path: "/profile", element: <ProfilePage /> },
  { path: "/services/:id", element: <ServiceDetailPage /> },
  { path: "/appointments", element: <MyAppointmentsPage /> },
  { path: "/appointments/:id", element: <MyAppointmentDetailPage /> },
];

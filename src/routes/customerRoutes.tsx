import MyAppointmentsPage from "../pages/customer/MyAppointmentsPage";
import MyAppointmentDetailPage from "../pages/customer/MyAppointmentDetailPage";
import ServicesPage from "../pages/customer/ServicesPage";
import ServiceDetailPage from "../pages/customer/ServiceDetailPage";
import ProfilePage from "../pages/shared/ProfilePage";

export const customerRoutes = [
  { path: "/", element: <MyAppointmentsPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/appointments", element: <MyAppointmentsPage /> },
  { path: "/appointments/:id", element: <MyAppointmentDetailPage /> },
  { path: "/services", element: <ServicesPage /> },
  { path: "/services/:id", element: <ServiceDetailPage /> },
];

import StaffAppointmentsPage from "../pages/staff/StaffAppointmentsPage";
import StaffAppointmentDetailPage from "../pages/staff/StaffAppointmentDetailPage";
import ProfilePage from "../pages/shared/ProfilePage";

export const staffRoutes = [
  { path: "/staff", element: <StaffAppointmentsPage /> },

  { path: "/staff/profile", element: <ProfilePage /> },
  { path: "/staff/appointments/:id", element: <StaffAppointmentDetailPage /> },
];

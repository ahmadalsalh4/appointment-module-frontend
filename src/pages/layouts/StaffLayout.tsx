import StaffSidebar from "../staff/components/StaffSidebar";
import DashboardLayout from "../../components/DashboardLayout";

export default function StaffLayout() {
  return <DashboardLayout sidebar={<StaffSidebar />} />;
}

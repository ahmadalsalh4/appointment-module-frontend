import AdminSidebar from "../admin/components/AdminSidebar";
import DashboardLayout from "../../components/DashboardLayout";

export default function AdminLayout() {
  return <DashboardLayout sidebar={<AdminSidebar />} />;
}

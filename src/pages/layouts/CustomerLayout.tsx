import CustomerSidebar from "../customer/components/CustomerSidebar";
import DashboardLayout from "../../components/DashboardLayout";

export default function CustomerLayout() {
  return <DashboardLayout sidebar={<CustomerSidebar />} />;
}

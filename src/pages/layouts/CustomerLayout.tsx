import { Outlet } from "react-router";
import CustomerSidebar from "../customer/components/CustomerSidebar";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-back">
      <CustomerSidebar />

      <div className="lg:pl-64">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

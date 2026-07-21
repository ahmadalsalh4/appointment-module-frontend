import { Outlet } from "react-router";
import CustomerSidebar from "../customer/components/CustomerSidebar";


export default function CustomerLayout() {
  return (
    <div className="min-h-full">
      {/* Render the Sidebar */}
      <CustomerSidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <main className="p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

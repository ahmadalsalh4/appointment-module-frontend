import { Outlet } from "react-router";
import StaffSidebar from "../staff/components/StaffSidebar";


export default function StaffLayout() {
  return (
    <div className="min-h-full">
      {/* Render the Sidebar */}
      <StaffSidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <main className="p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Outlet } from "react-router";
import StaffSidebar from "../staff/components/StaffSidebar";

export default function StaffLayout() {
  return (
    <div className="min-h-screen bg-back">
      <StaffSidebar />

      <div className="lg:pl-64">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

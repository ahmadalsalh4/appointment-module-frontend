import { Outlet } from "react-router";
import AdminSidebar from "../admin/components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-full">
      <AdminSidebar />

      <div className="lg:pl-64">
        <main className="p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Outlet } from "react-router";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  sidebar: ReactNode;
}

export default function DashboardLayout({ sidebar }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-back">
      {sidebar}
      <div className="lg:pl-64">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

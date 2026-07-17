import { Outlet } from "react-router";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-ink-50">
      <header>{/* nav */}</header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

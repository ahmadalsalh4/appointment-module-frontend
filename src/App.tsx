import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link, Route, Routes } from "react-router";
import PublicLayout from "./pages/layouts/PublicLayout";
import CustomerLayout from "./pages/layouts/CustomerLayout";
import StaffLayout from "./pages/layouts/StaffLayout";
import AdminLayout from "./pages/layouts/AdminLayout";

import RoleRoutes from "./routes/RoleRoutes";
import { customerRoutes } from "./routes/customerRoutes";
import { staffRoutes } from "./routes/staffRoutes";
import { adminRoutes } from "./routes/adminRoutes";

import Login from "./pages/shared/Login";
import Register from "./pages/shared/Register";
import UnauthorizedPage from "./pages/shared/UnauthorizedPage";
import NotFoundPage from "./pages/shared/NotFoundPage";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Top-level React error boundary. A render-time exception inside any
 * route takes down this boundary, displays a recoverable error page,
 * and lets the user retry by navigating away. Without this boundary
 * the entire SPA white-screens on any unhandled render error.
 */
class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[AppErrorBoundary]", error, info.componentStack);
  }

  reset = (): void => {
    // Reset the error state and stay on the current URL — using a
    // router Link instead of window.location preserves QueryClient
    // cache, AuthProvider state, and scroll position.
    this.setState({ hasError: false, error: undefined });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="page-xl text-center">
          <h1 className="text-3xl font-bold text-main mb-4">Bir şeyler ters gitti</h1>
          <p className="text-main/70 mb-6">
            Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyebilir veya ana sayfaya dönebilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={this.reset}
              className="btn-primary"
            >
              Tekrar Dene
            </button>
            <Link to="/" className="btn-secondary">Ana Sayfa</Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <Routes>
        {/* Public routes (Header + Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Role-based dashboards (sidebar only) — must be called as a function so the
            returned <Fragment> is inlined as a direct child of <Routes>. */}
        {RoleRoutes({
          allowedRole: "customer",
          layout: CustomerLayout,
          routes: customerRoutes,
        })}
        {RoleRoutes({
          allowedRole: "staff",
          layout: StaffLayout,
          routes: staffRoutes,
        })}
        {RoleRoutes({
          allowedRole: "admin",
          layout: AdminLayout,
          routes: adminRoutes,
        })}
      </Routes>
    </AppErrorBoundary>
  );
}

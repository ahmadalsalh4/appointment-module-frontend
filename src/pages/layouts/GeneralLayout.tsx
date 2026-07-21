import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../contexts/auth/useAuth";

export default function GlobalLayout() {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // You will need to create a logout function in your useAuth context later
    // For now, we just clear local storage and redirect
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login"; // Hard refresh to reset state
  };

  return (
    <div className="flex min-h-screen flex-col bg-back">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 w-full border-b border-main/10 bg-surface shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Logo / Home */}
          <button
            onClick={() => navigate(role === "customer" ? "/" : `/${role}`)}
            className="text-xl font-bold text-deep transition hover:opacity-80"
          >
            Randevu Sistemi
          </button>

          {/* Right: Profile & Logout (Only show if logged in) */}
          {token && role ? (
            <div className="flex items-center gap-3">
              {/* Profile Button */}
              <button
                onClick={() => navigate(`/${role}/profile`)}
                className="flex items-center gap-2 rounded-lg bg-back px-4 py-2 text-sm font-medium text-main transition hover:bg-main/10"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profilim
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-canceld/10 px-4 py-2 text-sm font-medium text-canceld transition hover:bg-canceld/20"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Çıkış
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-deep px-4 py-2 text-sm font-semibold text-surface transition hover:bg-deep/90"
            >
              Giriş Yap
            </button>
          )}
        </div>
      </header>

      {/* ===== MAIN CONTENT (Where Role Layouts render) ===== */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="w-full border-t border-main/10 bg-surface py-6">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-sm text-main/50">
            © 2026 Ahmad Alsaleh. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}

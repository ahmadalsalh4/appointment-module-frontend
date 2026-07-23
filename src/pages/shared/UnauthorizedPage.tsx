import { Link } from "react-router";
import { useAuth } from "../../contexts/auth/useAuth";

export default function UnauthorizedPage() {
  const { role } = useAuth();
  const linkTo =
    role === "customer"
      ? "/"
      : role === "admin"
        ? "/admin"
        : role === "staff"
          ? "/staff"
          : "/login";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-back p-6 text-center">
      {/* Icon Circle */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-canceld/10">
        <svg
          className="h-12 w-12 text-canceld"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="mt-6 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-main">Erişim Engellendi</h2>
        <p className="max-w-md text-main/70">
          Bu sayfayı görüntülemek için gerekli yetkilere sahip değilsiniz. Eğer
          bunun bir hata olduğunu düşünüyorsanız yöneticinizle iletişime geçin.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to={linkTo}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-deep px-6 py-3 text-sm font-semibold text-surface shadow-md transition-all hover:bg-deep/90 hover:shadow-lg active:scale-95"
        >
          Ana Sayfaya Dön
        </Link>

        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-main/20 bg-surface px-6 py-3 text-sm font-semibold text-main transition-all hover:bg-main/5 active:scale-95"
        >
          Farklı Hesapla Giriş Yap
        </Link>
      </div>
    </div>
  );
}

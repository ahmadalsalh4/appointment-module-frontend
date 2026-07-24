import { Link } from "react-router";
import { useAuth } from "../../contexts/auth/useAuth";

export default function NotFoundPage() {
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
      {/* Big 404 Text */}
      <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[14rem] font-black leading-none text-waiting/20">
        404
      </h1>

      {/* Content */}
      <div className="-mt-10 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-main text-wrap-balance">Sayfa Bulunamadı</h2>
        <p className="max-w-md text-main/70">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>
      </div>

      {/* Action Button */}
      <Link
        to={linkTo}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-deep px-6 py-3 text-sm font-semibold text-surface shadow-md transition-all hover:bg-deep/90 hover:shadow-lg active:scale-95"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

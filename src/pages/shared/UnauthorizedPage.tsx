import { Link } from "react-router";
import { Lock } from "lucide-react";
import { useAuth } from "../../contexts/auth/useAuth";
import { ROLE_HOME } from "../../utils/roleHome";

export default function UnauthorizedPage() {
  const { role } = useAuth();
  const linkTo = role ? ROLE_HOME[role] : "/login";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-back p-6 text-center">
      {/* Icon Circle */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-canceld/10">
        <Lock className="h-12 w-12 text-canceld" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="mt-6 space-y-3">
        <h2 className="page-header">Erişim Engellendi</h2>
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

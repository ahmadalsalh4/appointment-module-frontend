import { Link } from "react-router";
import { useAuth } from "../../contexts/auth/useAuth";
import { useGetProfileQuery } from "../../hooks/useProfileQueries";
import { useLogoutMutation } from "../../hooks/useAuthQueries";
import Loading from "../components/Loading";
import Avatar from "../../components/Avatar";
import type { UserRole } from "../../other/types";

const roleBadgeStyle: Record<UserRole, string> = {
  customer:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 ring-emerald-600/20",
  staff:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 ring-sky-600/20",
  admin:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 ring-violet-600/20",
};

// --- HELPERS ---
const roleLabel: Record<UserRole, string> = {
  customer: "Müşteri",
  staff: "Personel",
  admin: "Yönetici",
};

const roleGradient: Record<UserRole, string> = {
  customer: "from-emerald-500 via-emerald-600 to-teal-600",
  staff: "from-sky-500 via-blue-600 to-deep",
  admin: "from-violet-500 via-purple-600 to-fuchsia-600",
};

export default function ProfilePage() {
  const { role } = useAuth();
  const { mutate: logout } = useLogoutMutation();

  const handleLogout = () => {
    if (role) logout(role);
  };

  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useGetProfileQuery(role);

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (isError || !profileData) {
    return (
      <div className="p-6 text-center text-canceld">
        <p className="text-xl sm:text-2xl font-bold mb-2">Profil Yüklenemedi</p>
        <p>{(error as Error)?.message || "Lütfen tekrar giriş yapın."}</p>
      </div>
    );
  }

  const { person } = profileData.data;
  const currentRole = profileData.role;

  return (
    <div className="page-wide space-y-6">
      <div className="card-lg relative">
        <div
          className={`relative h-28 sm:h-32 bg-gradient-to-br ${roleGradient[currentRole]} rounded-t-2xl`}
        >
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <button
              onClick={() => alert("Profil düzenleme yakında aktif olacak.")}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg shadow-sm transition"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="hidden sm:inline">Profili Düzenle</span>
              <span className="sm:hidden">Düzenle</span>
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6">
          <div className="-mt-12 sm:-mt-14">
            <Avatar
              name={person.name}
              surname={person.surname}
              size="lg"
            />
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-main break-words text-balance">
              {person.name} {person.surname}
            </h1>
            <span className="text-xs text-main/40">
              #{profileData.data.id}
            </span>
          </div>
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset ${roleBadgeStyle[currentRole]}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {roleLabel[currentRole]}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-lg p-4 sm:p-6">
            <h3 className="section-header">İletişim Bilgileri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                <span className="icon-box shrink-0 mt-0.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="detail-label">Telefon</p>
                  <p className="detail-value">{person.phone_number || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                <span className="icon-box shrink-0 mt-0.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="detail-label">E-posta</p>
                  <p className="detail-value">{profileData.data.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-lg p-4 sm:p-6">
            <h3 className="section-header">Hesap Bilgileri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                <span className="icon-box shrink-0 mt-0.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="detail-label">Kayıt Tarihi</p>
                  <p className="detail-value">
                    {new Date(person.created_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                <span className="icon-box shrink-0 mt-0.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="detail-label">Hesap ID</p>
                  <p className="detail-value">{`#${profileData.data.id}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {currentRole === "admin" && (
            <div className="card-lg p-4 sm:p-6">
              <h3 className="section-header">Yönetici Paneli</h3>
              <p className="text-sm text-main/60 mb-4 leading-relaxed">
                Sistemin tam yetkili yöneticisisiniz. Tüm personel, kategori ve
                randevu işlemlerini yönetebilirsiniz.
              </p>
              <div className="space-y-2">
                <Link
                  to="/admin"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard'a Git
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/admin/staff"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-back hover:bg-main/10 text-main/70 rounded-lg text-sm font-medium transition-colors"
                >
                  Personeli Yönet
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {currentRole === "staff" && (
            <div className="card-lg p-4 sm:p-6">
              <h3 className="section-header">Personel Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                  <span className="icon-box shrink-0 mt-0.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="detail-label">Pozisyon / Görev</p>
                    <p className="detail-value">{profileData.data.job_title}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                  <span className="icon-box shrink-0 mt-0.5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="detail-label">Kategori</p>
                    <p className="detail-value">{profileData.data.category?.name ?? "Atanmamış"}</p>
                  </div>
                </div>
                {profileData.data.managing_admin && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                    <span className="icon-box shrink-0 mt-0.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="detail-label">Yöneticisi</p>
                      <p className="detail-value">{profileData.data.managing_admin.email}</p>
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/staff"
                className="mt-4 flex items-center justify-between w-full px-4 py-2.5 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-800 dark:text-sky-300 rounded-lg text-sm font-medium transition-colors"
              >
                Randevularım
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          {currentRole === "customer" && (
            <div className="card-lg p-4 sm:p-6">
              <h3 className="section-header">Müşteri Hesabı</h3>
              <p className="text-sm text-main/60 mb-4 leading-relaxed">
                Bu panel üzerinden randevularınızı oluşturabilir,
                görüntüleyebilir ve iptal edebilirsiniz.
              </p>
              <div className="space-y-2">
                <Link
                  to="/appointments"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Randevularım
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/services"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-back hover:bg-main/10 text-main/70 rounded-lg text-sm font-medium transition-colors"
                >
                  Yeni Randevu Oluştur
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          <div className="card-lg p-4 sm:p-6">
            <h3 className="section-header">Güvenlik</h3>
            <div className="space-y-2">
              <button
                onClick={() => alert("Şifre değiştirme yakında aktif olacak.")}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-back hover:bg-main/10 text-main/70 rounded-lg text-sm font-medium transition-colors text-left"
              >
                Şifre Değiştir
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-canceld/10 hover:bg-canceld/15 text-canceld rounded-lg text-sm font-medium transition-colors text-left"
              >
                Oturumu Kapat
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

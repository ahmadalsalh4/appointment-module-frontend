import { Link } from "react-router";
import { Calendar, ChevronRight, LogOut, Mail, Monitor, Pencil, Phone, Plus, Tag } from "lucide-react";
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
              <Pencil className="h-4 w-4" />
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
                  <Phone className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="detail-label">Telefon</p>
                  <p className="detail-value">{person.phone_number || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                <span className="icon-box shrink-0 mt-0.5">
                  <Mail className="h-4 w-4" />
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
                  <Calendar className="h-4 w-4" />
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
                  <Tag className="h-4 w-4" />
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
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/admin/staff"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-back hover:bg-main/10 text-main/70 rounded-lg text-sm font-medium transition-colors"
                >
                  Personeli Yönet
                  <ChevronRight className="h-4 w-4" />
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
                    <Monitor className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="detail-label">Pozisyon / Görev</p>
                    <p className="detail-value">{profileData.data.job_title}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                  <span className="icon-box shrink-0 mt-0.5">
                    <Tag className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="detail-label">Kategori</p>
                    <p className="detail-value">{profileData.data.category?.name ?? "Atanmamış"}</p>
                  </div>
                </div>
                {profileData.data.managing_admin && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-surface ring-1 ring-main/10 min-w-0">
                    <span className="icon-box shrink-0 mt-0.5">
                      <Mail className="h-4 w-4" />
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
                <ChevronRight className="h-4 w-4" />
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
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-back hover:bg-main/10 text-main/70 rounded-lg text-sm font-medium transition-colors"
                >
                  Yeni Randevu Oluştur
                    <Plus className="h-4 w-4" />
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
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-canceld/10 hover:bg-canceld/15 text-canceld rounded-lg text-sm font-medium transition-colors text-left"
              >
                Oturumu Kapat
                <LogOut className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

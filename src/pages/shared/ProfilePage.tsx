import { Link } from "react-router";
import { Calendar, ChevronRight, LogOut, Mail, Monitor, Phone, Tag } from "lucide-react";
import { useAuth } from "../../contexts/auth/useAuth";
import { useGetProfileQuery } from "../../hooks/useProfileQueries";
import { useLogoutMutation } from "../../hooks/useAuthQueries";
import QueryGate from "../../components/QueryGate";
import Avatar from "../../components/Avatar";
import type { UserRole } from "../../other/types";
import { formatDate } from "../../utils/dates";

const roleLabel: Record<UserRole, string> = {
  customer: "Müşteri",
  staff: "Personel",
  admin: "Yönetici",
};

const roleBadgeStyle: Record<UserRole, string> = {
  customer: "bg-main/5 text-main/70",
  staff: "bg-deep/10 text-deep",
  admin: "bg-deep/15 text-deep font-semibold",
};

export default function ProfilePage() {
  const { role } = useAuth();
  const { mutate: logout } = useLogoutMutation();
  const handleLogout = () => {
    if (role) logout(role);
  };

  const { data: profileData, isLoading, isError, error } = useGetProfileQuery(role);

  if (isError || !profileData) {
    return (
      <div className="page-wide flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="w-16 h-16 rounded-full bg-canceld/10 flex items-center justify-center mb-4">
          <LogOut className="h-8 w-8 text-canceld" />
        </div>
        <h1 className="page-header">Profil Yüklenemedi</h1>
        <p className="mt-2 text-main/60">
          {(error as Error)?.message || "Lütfen tekrar giriş yapın."}
        </p>
        <Link to="/login" className="btn-primary mt-6">
          Giriş Yap
        </Link>
      </div>
    );
  }

  const { person } = profileData.data;
  const currentRole = profileData.role;

  return (
    <QueryGate isLoading={isLoading} isError={false} errorMessage="">
    <div className="page-wide">
      {/* ── Identity section ── */}
      <section className="relative pt-8 pb-6">
        <div className="flex flex-col items-center text-center">
          <Avatar name={person.name} surname={person.surname} size="lg" />

          <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold text-main break-words text-balance leading-tight">
            {person.name} {person.surname}
          </h1>

          <div className="mt-2 flex items-center gap-2.5">
            <span className="text-sm text-main/40 tabular-nums">#{profileData.data.id}</span>
            <span className="w-1 h-1 rounded-full bg-main/20" />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${roleBadgeStyle[currentRole]}`}>
              {roleLabel[currentRole]}
            </span>
          </div>

          <p className="mt-2 text-sm text-main/50">
            {formatDate(person.created_at)} tarihinden beri üye
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 rounded-xl bg-back border border-main/5">
            <div className="flex items-center gap-2 text-sm text-main/70">
              <Phone className="h-4 w-4 shrink-0 text-main/40" />
              <span>{person.phone_number || "—"}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-main/10" />
            <div className="flex items-center gap-2 text-sm text-main/70">
              <Mail className="h-4 w-4 shrink-0 text-main/40" />
              <span className="truncate max-w-[220px]">{profileData.data.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-b border-main/10" />
      </section>

      {/* ── Body: role context (left) + navigation (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left column: role-specific context */}
        <div className="lg:col-span-2">
          {currentRole === "staff" && (
            <section>
              <h2 className="text-lg font-bold text-main mb-4">Personel Bilgileri</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2.5 border-b border-main/5">
                  <Monitor className="h-5 w-5 shrink-0 text-main/40" />
                  <div>
                    <p className="text-xs text-main/40">Pozisyon / Görev</p>
                    <p className="text-sm font-semibold text-main">{profileData.data.job_title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2.5 border-b border-main/5">
                  <Tag className="h-5 w-5 shrink-0 text-main/40" />
                  <div>
                    <p className="text-xs text-main/40">Kategori</p>
                    <p className="text-sm font-semibold text-main">{profileData.data.category?.name ?? "Atanmamış"}</p>
                  </div>
                </div>
                {profileData.data.managing_admin && (
                  <div className="flex items-center gap-3 py-2.5 border-b border-main/5">
                    <Mail className="h-5 w-5 shrink-0 text-main/40" />
                    <div>
                      <p className="text-xs text-main/40">Yöneticisi</p>
                      <p className="text-sm font-semibold text-main">{profileData.data.managing_admin.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {currentRole === "admin" && (
            <section>
              <h2 className="text-lg font-bold text-main mb-3">Yönetici Paneli</h2>
              <p className="text-sm text-main/60 leading-relaxed mb-5">
                Sistemin tam yetkili yöneticisisiniz. Tüm personel, kategori ve randevu işlemlerini yönetebilirsiniz.
              </p>
              <div className="space-y-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-deep/10 text-deep hover:bg-deep/15 text-sm font-semibold transition-colors"
                >
                  <span className="w-6 h-6 rounded bg-deep/20 flex items-center justify-center">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                  Dashboard&apos;a Git
                </Link>
                <Link
                  to="/admin/staff"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-main/5 text-main/70 text-sm font-medium transition-colors"
                >
                  <span className="w-6 h-6 rounded bg-main/5 flex items-center justify-center">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                  Personeli Yönet
                </Link>
              </div>
            </section>
          )}

          {currentRole === "customer" && (
            <section>
              <h2 className="text-lg font-bold text-main mb-4">Müşteri Hesabı</h2>
              <p className="text-sm text-main/60 leading-relaxed mb-5">
                Bu panel üzerinden randevularınızı oluşturabilir, görüntüleyebilir ve iptal edebilirsiniz.
              </p>
              <div className="space-y-2">
                <Link
                  to="/appointments"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-deep/10 text-deep hover:bg-deep/15 text-sm font-semibold transition-colors"
                >
                  <span className="w-6 h-6 rounded bg-deep/20 flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5" />
                  </span>
                  Randevularım
                </Link>
                <Link
                  to="/services"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-main/5 text-main/70 text-sm font-medium transition-colors"
                >
                  <span className="w-6 h-6 rounded bg-main/5 flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5" />
                  </span>
                  Yeni Randevu Oluştur
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* Right column: account info + security */}
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold text-main mb-4">Hesap Bilgileri</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-2.5 border-b border-main/5">
                <Tag className="h-5 w-5 shrink-0 text-main/40" />
                <div>
                  <p className="text-xs text-main/40">Hesap ID</p>
                  <p className="text-sm font-semibold text-main">#{profileData.data.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2.5 border-b border-main/5">
                <Calendar className="h-5 w-5 shrink-0 text-main/40" />
                <div>
                  <p className="text-xs text-main/40">Kayıt Tarihi</p>
                  <p className="text-sm font-semibold text-main">{formatDate(person.created_at)}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-main mb-4">Güvenlik</h2>
            <div className="space-y-2">
              <button
                onClick={() => alert("Şifre değiştirme yakında aktif olacak.")}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-main/5 text-main/70 text-sm font-medium transition-colors text-left"
              >
                Şifre Değiştir
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-canceld hover:bg-canceld/10 text-sm font-medium transition-colors text-left"
              >
                Oturumu Kapat
                <LogOut className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </section>
        </div>
      </div>
      </div>
    </QueryGate>
  );
}

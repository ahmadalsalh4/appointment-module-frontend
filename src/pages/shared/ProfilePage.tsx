import { Link } from "react-router";
import { useAuth } from "../../contexts/auth/useAuth";
import { useGetProfileQuery } from "../../hooks/useProfileQueries";
import { useLogoutMutation } from "../../hooks/useAuthQueries";
import Loading from "../components/Loading";
import type { UserRole } from "../../other/types";

// --- ICONS (kept inline to avoid extra files) ---
const PhoneIcon = () => (
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
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const EmailIcon = () => (
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
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const CalendarIcon = () => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const BriefcaseIcon = () => (
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
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const TagIcon = () => (
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
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const ShieldIcon = () => (
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
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const PencilIcon = () => (
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
);

// --- HELPERS ---
const roleLabel: Record<UserRole, string> = {
  customer: "Müşteri",
  staff: "Personel",
  admin: "Yönetici",
};

const roleGradient: Record<UserRole, string> = {
  customer: "from-emerald-500 via-emerald-600 to-teal-600",
  staff: "from-sky-500 via-blue-600 to-indigo-600",
  admin: "from-violet-500 via-purple-600 to-fuchsia-600",
};

const roleBadgeStyle: Record<UserRole, string> = {
  customer:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 ring-emerald-600/20",
  staff:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 ring-sky-600/20",
  admin:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 ring-violet-600/20",
};

const InfoField = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800/60 ring-1 ring-gray-200 dark:ring-gray-700 min-w-0">
    <div className="shrink-0 mt-0.5 text-gray-400 dark:text-gray-500">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">
        {value}
      </p>
    </div>
  </div>
);

const SectionTitle = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="text-deep">{icon}</div>
    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
      {title}
    </h3>
  </div>
);

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
      <div className="p-6 text-center text-red-500 dark:text-red-400">
        <p className="text-xl sm:text-2xl font-bold mb-2">Profil Yüklenemedi</p>
        <p>{(error as Error)?.message || "Lütfen tekrar giriş yapın."}</p>
      </div>
    );
  }

  const { person } = profileData.data;
  const initials =
    `${person.name.charAt(0)}${person.surname.charAt(0)}`.toUpperCase();
  const currentRole = profileData.role;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* HERO HEADER */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Banner with gradient + Edit button overlay */}
        <div
          className={`relative h-28 sm:h-32 bg-gradient-to-br ${roleGradient[currentRole]} rounded-t-2xl`}
        >
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <button
              onClick={() => alert("Profil düzenleme yakında aktif olacak.")}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg shadow-sm transition"
            >
              <PencilIcon />
              <span className="hidden sm:inline">Profili Düzenle</span>
              <span className="sm:hidden">Düzenle</span>
            </button>
          </div>
        </div>

        {/* Avatar overlapping the banner */}
        <div className="px-4 sm:px-6">
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br ${roleGradient[currentRole]} ring-4 ring-white dark:ring-gray-800 shadow-lg -mt-12 sm:-mt-14 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold`}
          >
            {initials}
          </div>
        </div>

        {/* Name + role badge — on the white card area, not on the gradient */}
        <div className="px-4 sm:px-6 pt-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 break-words">
              {person.name} {person.surname}
            </h1>
            <span className="text-xs text-gray-500 dark:text-gray-400">
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
        {/* LEFT COLUMN: Contact & Account */}
        <div className="lg:col-span-2 space-y-6">
          {/* CONTACT */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <SectionTitle
              icon={
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
              }
              title="İletişim Bilgileri"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoField
                label="Telefon"
                value={person.phone_number || "—"}
                icon={<PhoneIcon />}
              />
              <InfoField
                label="E-posta"
                value={profileData.data.email}
                icon={<EmailIcon />}
              />
            </div>
          </div>

          {/* ACCOUNT */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <SectionTitle
              icon={
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
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
                  />
                </svg>
              }
              title="Hesap Bilgileri"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoField
                label="Kayıt Tarihi"
                value={new Date(person.created_at).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                icon={<CalendarIcon />}
              />
              <InfoField
                label="Hesap ID"
                value={`#${profileData.data.id}`}
                icon={<TagIcon />}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Role-specific & Security */}
        <div className="space-y-6">
          {/* ROLE-SPECIFIC */}
          {currentRole === "admin" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
              <SectionTitle icon={<ShieldIcon />} title="Yönetici Paneli" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Sistemin tam yetkili yöneticisisiniz. Tüm personel, kategori ve
                randevu işlemlerini yönetebilirsiniz.
              </p>
              <div className="space-y-2">
                <Link
                  to="/admin"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard'a Git
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <Link
                  to="/admin/staff"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Personeli Yönet
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {currentRole === "staff" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
              <SectionTitle
                icon={<BriefcaseIcon />}
                title="Personel Bilgileri"
              />
              <div className="space-y-3">
                <InfoField
                  label="Pozisyon / Görev"
                  value={profileData.data.job_title}
                  icon={<BriefcaseIcon />}
                />
                <InfoField
                  label="Kategori"
                  value={profileData.data.category?.name ?? "Atanmamış"}
                  icon={<TagIcon />}
                />
                {profileData.data.managing_admin && (
                  <InfoField
                    label="Yöneticisi"
                    value={profileData.data.managing_admin.email}
                    icon={<EmailIcon />}
                  />
                )}
              </div>
              <Link
                to="/staff"
                className="mt-4 flex items-center justify-between w-full px-4 py-2.5 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-800 dark:text-sky-300 rounded-lg text-sm font-medium transition-colors"
              >
                Randevularım
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}

          {currentRole === "customer" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
              <SectionTitle icon={<CalendarIcon />} title="Müşteri Hesabı" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Bu panel üzerinden randevularınızı oluşturabilir,
                görüntüleyebilir ve iptal edebilirsiniz.
              </p>
              <div className="space-y-2">
                <Link
                  to="/appointments"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Randevularım
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <Link
                  to="/services"
                  className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Yeni Randevu Oluştur
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* SECURITY */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <SectionTitle icon={<ShieldIcon />} title="Güvenlik" />
            <div className="space-y-2">
              <button
                onClick={() => alert("Şifre değiştirme yakında aktif olacak.")}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors text-left"
              >
                Şifre Değiştir
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium transition-colors text-left"
              >
                Oturumu Kapat
                <svg
                  className="h-4 w-4 shrink-0"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

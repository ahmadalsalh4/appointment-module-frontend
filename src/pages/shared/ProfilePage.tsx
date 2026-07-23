import { Link } from "react-router";
import { useAuth } from "../../contexts/auth/useAuth";
import { useGetProfileQuery } from "../../hooks/useProfileQueries";
import Loading from "../components/Loading";

export default function ProfilePage() {
  const { role } = useAuth();

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
      <div className="p-6 text-center text-red-500">
        <p className="text-2xl font-bold mb-2">Profil Yüklenemedi</p>
        <p>{(error as Error)?.message || "Lütfen tekrar giriş yapın."}</p>
      </div>
    );
  }

  const { person } = profileData.data;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8 transition-colors">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        Profil Bilgileri
      </h1>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:space-x-6 sm:gap-0 mb-8">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
            {person.name.charAt(0)}
            {person.surname.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {person.name} {person.surname}
            </h2>
            <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 uppercase">
              {profileData.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {person.phone_number}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">E-Posta</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {profileData.data.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kayıt Tarihi
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {new Date(person.created_at).toLocaleDateString("tr-TR")}
            </p>
          </div>
        </div>

        {profileData.role === "admin" && (
          <div className="mt-6 p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded">
            <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">
              Yönetici Paneli
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Sistemin tam yetkili yöneticisisiniz. Tüm personel, kategori ve
              randevu işlemlerini yönetebilirsiniz.
            </p>
          </div>
        )}

        {profileData.role === "staff" && (
          <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded space-y-2">
            <h3 className="font-bold text-blue-800 dark:text-blue-300">
              Personel Bilgileri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Pozisyon / Görev
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {profileData.data.job_title}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Kategori
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {profileData.data.category?.name ?? "Atanmamış"}
                </p>
              </div>
              {profileData.data.managing_admin && (
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Yöneticisi
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {profileData.data.managing_admin.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {profileData.role === "customer" && (
          <div className="mt-6 p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded">
            <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">
              Müşteri Hesabı
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Bu panel üzerinden randevularınızı oluşturabilir, görüntüleyebilir
              ve iptal edebilirsiniz.
            </p>
            <Link
              to="/appointments"
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Randevularım
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

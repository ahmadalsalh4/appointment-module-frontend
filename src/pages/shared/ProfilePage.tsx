import { Link } from "react-router";
import { useAuth } from "../../contexts/auth/useAuth";
import { useGetProfileQuery } from "../../hooks/useProfileQueries";
import Loading from "../components/Loading";

export default function ProfilePage() {
  const { role } = useAuth();

  // Pass the current role to the hook.
  // It will automatically hit /customer/profile, /staff/profile, or /admin/profile
  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useGetProfileQuery(role);

  // 1. Loading State
  if (isLoading) {
    return <Loading></Loading>;
  }

  // 2. Error State
  if (isError || !profileData) {
    return (
      <div className="p-6 text-center text-red-500">
        <p className="text-2xl font-bold mb-2">Profil Yüklenemedi</p>
        <p>{(error as Error)?.message || "Lütfen tekrar giriş yapın."}</p>
      </div>
    );
  }

  // 3. SUCCESS STATE
  // Because of our Discriminated Union, TypeScript knows EXACTLY what is inside profileData.data
  // based on profileData.role!

  // Extract the common Person data safely (exists on all 3 roles)
  const { person } = profileData.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
        Profil Bilgileri
      </h1>

      {/* --- COMMON FIELDS (All Roles Have These) --- */}
      <div className="space-y-6">
        <div className="flex items-center space-x-6 mb-8">
          {/* Simple Avatar Placeholder */}
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {person.name.charAt(0)}
            {person.surname.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {person.name} {person.surname}
            </h2>
            <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 uppercase">
              {profileData.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Telefon</p>
            <p className="text-lg font-medium text-gray-900">
              {person.phone_number}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">E-Posta</p>
            <p className="text-lg font-medium text-gray-900">
              {profileData.data.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Kayıt Tarihi</p>
            <p className="text-lg font-medium text-gray-900">
              {new Date(person.created_at).toLocaleDateString("tr-TR")}
            </p>
          </div>
        </div>

        {/* --- DYNAMIC FIELDS BASED ON ROLE --- */}

        {/* ADMIN SPECIFIC FIELDS */}
        {profileData.role === "admin" && (
          <div className="mt-6 p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
            <h3 className="font-bold text-purple-800 mb-2">Yönetici Paneli</h3>
            <p className="text-sm text-purple-700">
              Sistemin tam yetkili yöneticisisiniz. Tüm personel, kategori ve
              randevu işlemlerini yönetebilirsiniz.
            </p>
          </div>
        )}

        {/* STAFF SPECIFIC FIELDS */}
        {profileData.role === "staff" && (
          <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded space-y-2">
            <h3 className="font-bold text-blue-800">Personel Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-blue-600">Pozisyon / Görev</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profileData.data.job_title}
                </p>
              </div>
              {profileData.data.managing_admin && (
                <div>
                  <p className="text-sm text-blue-600">Yöneticisi</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {profileData.data.managing_admin.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CUSTOMER SPECIFIC FIELDS */}
        {profileData.role === "customer" && (
          <div className="mt-6 p-4 border-l-4 border-green-500 bg-green-50 rounded">
            <h3 className="font-bold text-green-800 mb-2">Müşteri Hesabı</h3>
            <p className="text-sm text-green-700">
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

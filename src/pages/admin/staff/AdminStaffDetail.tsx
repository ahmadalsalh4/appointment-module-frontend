import { useParams, Link } from "react-router";
import { useGetStaffByIdQuery } from "../../../hooks/useStaffQueries";

export default function AdminStaffDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: staff, isLoading, isError } = useGetStaffByIdQuery(id || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !staff) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500 dark:text-red-400">
        <p className="text-xl font-bold">Personel bulunamadı.</p>
        <Link
          to="/admin/staff"
          className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Personel Listesine Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/admin/staff" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Personel
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {staff.person.name} {staff.person.surname}
        </span>
      </nav>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 lg:p-8 bg-indigo-50 dark:bg-indigo-900/40 border-b border-indigo-100 dark:border-indigo-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-3xl font-bold">
                {staff.person.name.charAt(0)}
                {staff.person.surname.charAt(0)}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 break-words">
                  {staff.person.name} {staff.person.surname}
                </h1>
                <p className="text-indigo-700 dark:text-indigo-300 font-semibold">
                  {staff.job_title}
                </p>
              </div>
            </div>
            <Link
              to={`/admin/staff/${staff.id}/edit`}
              className="px-5 py-2.5 text-sm font-medium text-yellow-700 dark:text-yellow-300 bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 shadow-sm"
            >
              Bilgileri Düzenle
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
              İletişim Bilgileri
            </h2>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                  İş E-Posta (Giriş)
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 break-words">{staff.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Telefon</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 break-words">
                  {staff.person.phone_number}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
              Sistem Bilgileri
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Kategori:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {staff.category?.name ?? "Atanmamış"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Kayıt Tarihi:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(
                    staff.created_at.split("T")[0] + "T00:00:00",
                  ).toLocaleDateString("tr-TR")}
                </span>
              </div>
              {staff.managing_admin && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Yöneticisi:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {staff.managing_admin.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

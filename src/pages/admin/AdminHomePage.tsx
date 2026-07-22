import { Link } from "react-router";
import { useAdminGetAppointmentsQuery } from "../../hooks/useAppointmentQueries";
import { useGetAllStaffQuery } from "../../hooks/useStaffQueries";
import { useGetAllCategoriesQuery } from "../../hooks/useCategoryQueries";
import type { CustomerProfile } from "../../other/types";

// Helper to format time without timezone shift
const formatSafeTime = (isoString: string) => {
  return (
    isoString.split("T")[1]?.split(".")[0].split(":").slice(0, 2).join(":") ||
    ""
  );
};

// Status Badge Styles
const getStatusStyle = (statusName: string) => {
  switch (statusName) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const getStatusText = (statusName: string) => {
  switch (statusName) {
    case "confirmed":
      return "Onaylandı";
    case "completed":
      return "Tamamlandı";
    case "cancelled":
      return "İptal Edildi";
    case "pending":
    default:
      return "Beklemede";
  }
};

export default function AdminHomePage() {
  // Fetch real data for the dashboard cards
  const { data: appointments, isLoading: loadingAppos } =
    useAdminGetAppointmentsQuery();
  const { data: staffList } = useGetAllStaffQuery();
  const { data: categories } = useGetAllCategoriesQuery();

  // Calculate metrics safely (Fixed .length error)
  const pendingAppos =
    appointments?.filter((a) => a.status.name === "pending") || [];
  const uniqueCustomersMap = new Map(
    appointments
      ?.map((a) => [a.customer_id, a.customer])
      .filter((a) => a[1] !== undefined) as [number, CustomerProfile][],
  );
  const totalCustomers = Array.from(uniqueCustomersMap.values());

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Paneli</h1>
        <p className="mt-1 text-gray-500">
          Sistemin genel durumunu buradan takip edin.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Staff Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Toplam Personel</p>
            <p className="text-2xl font-bold text-gray-900">
              {staffList?.length || 0}
            </p>
          </div>
        </div>

        {/* Total Categories Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Kategoriler</p>
            <p className="text-2xl font-bold text-gray-900">
              {categories?.length || 0}
            </p>
          </div>
        </div>

        {/* Pending Appointments Card */}
        <Link
          to="/admin/appointments"
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Onay Bekleyen</p>
            <p className="text-2xl font-bold text-gray-900">
              {pendingAppos.length}
            </p>
          </div>
        </Link>

        {/* Total Customers Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Aktif Müşteriler
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {totalCustomers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Pending List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Hızlı İşlemler
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/staff/add"
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <span>+ Yeni Personel Ekle</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
              to="/admin/categories/add"
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <span>+ Yeni Kategori Ekle</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
              to="/admin/services/add"
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <span>+ Yeni Hizmet Ekle</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
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

        {/* Latest Pending Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Son Bekleyen Randevular
            </h2>
            <Link
              to="/admin/appointments"
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              Tümünü Gör
            </Link>
          </div>

          {loadingAppos ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : pendingAppos.length === 0 ? (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
              Onay bekleyen bir randevu yok.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingAppos.slice(0, 4).map((appo) => (
                <div
                  key={appo.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase">
                        {new Date(
                          appo.start_date.split("T")[0],
                        ).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatSafeTime(appo.start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {appo.service.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appo.customer?.person.name}{" "}
                        {appo.customer?.person.surname}
                        <span className="mx-1">•</span>
                        {appo.staff?.person.name} {appo.staff?.person.surname}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(appo.status.name)}`}
                  >
                    {getStatusText(appo.status.name)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { useAdminGetAppointmentsQuery } from "../../hooks/useAppointmentQueries";
import { useGetAllStaffQuery } from "../../hooks/useStaffQueries";
import { useGetAllCategoriesQuery } from "../../hooks/useCategoryQueries";
import type { CustomerProfile } from "../../other/types";
import StatusBadge from "../../components/StatusBadge";
import PageHeader from "../../components/PageHeader";
import { formatTime, formatMonthDay } from "../../utils/dates";

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
    <div className="page-xl space-y-8">
      <PageHeader
        title="Admin Paneli"
        subtitle="Sistemin genel durumunu buradan takip edin."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Staff Card */}
        <div className="card p-6 flex items-center gap-4">
          <div className="icon-box">
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
            <p className="text-sm font-medium text-main/60">Toplam Personel</p>
            <p className="text-2xl sm:text-3xl font-bold text-main">
              {staffList?.length || 0}
            </p>
          </div>
        </div>

        {/* Total Categories Card */}
        <div className="card p-6 flex items-center gap-4">
          <div className="icon-box">
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
            <p className="text-sm font-medium text-main/60">Kategoriler</p>
            <p className="text-2xl sm:text-3xl font-bold text-main">
              {categories?.length || 0}
            </p>
          </div>
        </div>

        {/* Pending Appointments Card */}
        <Link
          to="/admin/appointments"
          className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-waiting/10 rounded-lg text-waiting">
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
            <p className="text-sm font-medium text-main/60">Onay Bekleyen</p>
            <p className="text-2xl sm:text-3xl font-bold text-main">
              {pendingAppos.length}
            </p>
          </div>
        </Link>

        {/* Total Customers Card */}
        <div className="card p-6 flex items-center gap-4">
          <div className="p-3 bg-completed/10 rounded-lg text-completed">
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
            <p className="text-sm font-medium text-main/60">
              Aktif Müşteriler
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-main">
              {totalCustomers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Pending List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 section-gap">
        {/* Quick Actions */}
        <div className="card p-6 h-fit">
          <h2 className="text-lg font-bold text-main mb-4">
            Hızlı İşlemler
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/staff/add"
              className="flex items-center justify-between w-full px-4 py-3 bg-back rounded-lg text-sm font-medium text-main/80 hover:bg-deep/5 hover:text-deep transition-colors"
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
              className="flex items-center justify-between w-full px-4 py-3 bg-back rounded-lg text-sm font-medium text-main/80 hover:bg-deep/5 hover:text-deep transition-colors"
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
              className="flex items-center justify-between w-full px-4 py-3 bg-back rounded-lg text-sm font-medium text-main/80 hover:bg-deep/5 hover:text-deep transition-colors"
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
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-main">
              Son Bekleyen Randevular
            </h2>
            <Link
              to="/admin/appointments"
              className="text-sm text-deep hover:underline font-medium"
            >
              Tümünü Gör
            </Link>
          </div>

          {loadingAppos ? (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          ) : pendingAppos.length === 0 ? (
            <p className="text-main/60 text-center py-8 bg-back rounded-lg">
              Onay bekleyen bir randevu yok.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingAppos.slice(0, 4).map((appo) => (
                <div
                  key={appo.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-back rounded-lg border border-main/5"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-center shrink-0">
                      <p className="text-xs text-main/40 uppercase">
                        {formatMonthDay(appo.start_date).day}{" "}
                        {formatMonthDay(appo.start_date).month}
                      </p>
                      <p className="text-lg font-bold text-main">
                        {formatTime(appo.start_date)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-main truncate">
                        {appo.service.name}
                      </p>
                      <p className="text-sm text-main/60 truncate">
                        {appo.customer?.person.name}{" "}
                        {appo.customer?.person.surname}
                        <span className="mx-1">•</span>
                        {appo.staff?.person.name} {appo.staff?.person.surname}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={appo.status.name} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

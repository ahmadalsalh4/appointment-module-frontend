import { Link } from "react-router";
import { Briefcase, ChevronRight, Clock, User, Users } from "lucide-react";
import { useAdminGetAppointmentsQuery } from "../../hooks/useAppointmentQueries";
import { useGetAllStaffQuery } from "../../hooks/useStaffQueries";
import { useGetAllCategoriesQuery } from "../../hooks/useCategoryQueries";
import type { CustomerProfile } from "../../other/types";
import StatusBadge from "../../components/StatusBadge";
import PageHeader from "../../components/PageHeader";
import QueryGate from "../../components/QueryGate";
import { SkeletonStatCard } from "../../components/skeletons/SkeletonPatterns";
import { Skeleton } from "../../components/skeletons/Skeleton";
import { formatTime, formatMonthDay } from "../../utils/dates";

export default function AdminHomePage() {
  // The dashboard needs the latest pending appointments to render the
  // list AND the paginated `total` for the count card. We use a small
  // per_page for the list itself and trust the metadata for the count.
  // (Previously used per_page: 9999 which is dangerous at scale and
  // also hid the real pending count when there were more than 9999.)
  const {
    data: appointments,
    isLoading: loadingAppos,
    isError: appointmentsError,
  } = useAdminGetAppointmentsQuery({ per_page: 50, tab: "pending" });
  const {
    data: staffList,
    isLoading: loadingStaff,
    isError: staffError,
  } = useGetAllStaffQuery({ per_page: 1 });
  const {
    data: categories,
    isLoading: loadingCategories,
    isError: categoriesError,
  } = useGetAllCategoriesQuery({ per_page: 1 });

  const pendingAppos =
    appointments?.data?.filter((a) => a.status.name === "pending") ?? [];
  const customerEntries =
    appointments?.data
      ?.map((a) => [a.customer_id, a.customer] as [number, CustomerProfile | undefined])
      ?.filter((entry): entry is [number, CustomerProfile] => entry[1] !== undefined) ??
    [];
  const uniqueCustomersMap = new Map<number, CustomerProfile>(customerEntries);
  const totalCustomers = Array.from(uniqueCustomersMap.values());

  // The paginated `total` is the source of truth for the pending-count
  // card; `pendingAppos.length` would undercount when more than 50
  // appointments are pending. With per_page: 1 we get the same `total`
  // for staff/categories without loading every row.
  const totalPending = appointments?.total ?? 0;
  const totalStaff = staffList?.total ?? 0;
  const totalCategories = categories?.total ?? 0;

  return (
    <div className="page-xl space-y-8">
      <PageHeader
        title="Admin Paneli"
        subtitle="Sistemin genel durumunu buradan takip edin."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Staff Card */}
        {loadingStaff ? (
          <SkeletonStatCard />
        ) : staffError ? (
          <div className="card p-6 text-canceld text-sm">Personel sayısı yüklenemedi.</div>
        ) : (
          <div className="card p-6 flex items-center gap-4">
            <div className="icon-box">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-main/60">Toplam Personel</p>
              <p className="text-2xl sm:text-3xl font-bold text-main">
                {totalStaff}
              </p>
            </div>
          </div>
        )}

        {/* Total Categories Card */}
        {loadingCategories ? (
          <SkeletonStatCard />
        ) : categoriesError ? (
          <div className="card p-6 text-canceld text-sm">Kategori sayısı yüklenemedi.</div>
        ) : (
          <div className="card p-6 flex items-center gap-4">
            <div className="icon-box">
              <Briefcase className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-main/60">Kategoriler</p>
              <p className="text-2xl sm:text-3xl font-bold text-main">
                {totalCategories}
              </p>
            </div>
          </div>
        )}

        {/* Pending Appointments Card */}
        {loadingAppos ? (
          <SkeletonStatCard />
        ) : appointmentsError ? (
          <div className="card p-6 text-canceld text-sm">Bekleyen randevu sayısı yüklenemedi.</div>
        ) : (
          <Link
            to="/admin/appointments"
            className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="p-3 bg-waiting/10 rounded-lg text-waiting">
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-main/60">Onay Bekleyen</p>
              <p className="text-2xl sm:text-3xl font-bold text-main">
                {totalPending}
              </p>
            </div>
          </Link>
        )}

        {/* Total Customers Card */}
        <div className="card p-6 flex items-center gap-4">
          <div className="p-3 bg-completed/10 rounded-lg text-completed">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-main/60">
              Bekleyen Randevulu Müşteriler
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
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/admin/categories/add"
              className="flex items-center justify-between w-full px-4 py-3 bg-back rounded-lg text-sm font-medium text-main/80 hover:bg-deep/5 hover:text-deep transition-colors"
            >
              <span>+ Yeni Kategori Ekle</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/admin/services/add"
              className="flex items-center justify-between w-full px-4 py-3 bg-back rounded-lg text-sm font-medium text-main/80 hover:bg-deep/5 hover:text-deep transition-colors"
            >
              <span>+ Yeni Hizmet Ekle</span>
              <ChevronRight className="h-4 w-4" />
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

          <QueryGate
            isLoading={loadingAppos}
            isError={appointmentsError}
            errorMessage="Bekleyen randevular yüklenemedi."
            loading={
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 bg-back rounded-lg border border-main/5 flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            }
          >
          {pendingAppos.length === 0 ? (
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
          </QueryGate>
        </div>
      </div>
    </div>
  );
}

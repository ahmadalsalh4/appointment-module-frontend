import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useCustomerGetAppointmentsQuery } from "../../hooks/useAppointmentQueries";
import type { AppointmentFilters as ApptFilters } from "../../api/appointments";
import StatusBadge from "../../components/StatusBadge";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import QueryGate from "../../components/QueryGate";
import AppointmentFilters from "../admin/components/AppointmentFilters";
import Pagination from "../../components/Pagination";
import { SkeletonAppointmentCardList } from "../../components/skeletons/SkeletonPatterns";
import { formatDateTime, formatMonthDay } from "../../utils/dates";

export default function MyAppointmentsPage() {
  const [tab, setTab] = useState<string>("");
  const [statusId, setStatusId] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("start_date");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [perPage, setPerPage] = useState<number>(15);
  const [page, setPage] = useState<number>(1);

  const filters: ApptFilters = {
    ...(tab && { tab }),
    ...(statusId && { status_id: statusId }),
    ...(staffId && { staff_id: staffId }),
    ...(date && { date }),
    ...(customerName.trim() && { customer_name: customerName.trim() }),
    sort_by: sortBy,
    sort_order: sortOrder,
    per_page: perPage,
    page,
  };

  const { data: paginated, isLoading, isError } = useCustomerGetAppointmentsQuery(filters);
  const { data: allAppointments } = useCustomerGetAppointmentsQuery({ per_page: 200 });

  const appointments = paginated?.data ?? [];

  const staffOptions = useMemo(() => {
    const map = new Map<number, { id: number; name: string; surname: string }>();
    for (const apt of allAppointments?.data ?? []) {
      if (apt.staff) {
        map.set(apt.staff.id, {
          id: apt.staff.id,
          name: apt.staff.person?.name ?? "",
          surname: apt.staff.person?.surname ?? "",
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`, "tr"),
    );
  }, [allAppointments]);

  const clearFilters = () => {
    setTab("");
    setStatusId("");
    setStaffId("");
    setDate("");
    setCustomerName("");
    setSortBy("start_date");
    setSortOrder("asc");
    setPage(1);
  };

  return (
    <div className="page-2xl">
      <div className="mb-8">
        <PageHeader
          title="Randevularım"
          subtitle="Geçmiş ve yaklaşan randevularınızı burada yönetin."
          action={
            <Link to="/services" className="btn-primary">
              + Yeni Randevu
            </Link>
          }
        />
      </div>

      <div className="mb-6">
        <AppointmentFilters
          statusId={statusId}
          onStatusChange={setStatusId}
          date={date}
          onDateChange={setDate}
          tab={tab}
          onTabChange={setTab}
          customerName={customerName}
          onCustomerNameChange={setCustomerName}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          showSort
          showCustomerSearch
          onClear={clearFilters}
          hasActiveFilters={!!(tab || statusId || staffId || date || customerName)}
        >
          <div>
            <label className="label-sm">Personel</label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="input-filter focus:border-deep focus:ring-2 focus:ring-deep/20"
            >
              <option value="">Tümü</option>
              {staffOptions.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name} {s.surname}
                </option>
              ))}
            </select>
          </div>
        </AppointmentFilters>
      </div>

      <QueryGate
        isLoading={isLoading}
        isError={isError}
        errorMessage="Randevularınız yüklenirken bir hata oluştu."
        loading={<SkeletonAppointmentCardList count={6} />}
      >
        {appointments.length === 0 ? (
          <EmptyState
            message={
              tab || statusId || staffId || date
                ? "Seçili filtrelerle eşleşen randevu bulunamadı."
                : "Henüz bir randevunuz bulunmuyor."
            }
            action={
              !tab && !statusId && !staffId && !date ? (
                <Link to="/services" className="text-deep font-semibold hover:underline">
                  İlk randevunuzu oluşturun
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const { day, month } = formatMonthDay(appointment.start_date);
                return (
                <Link
                  key={appointment.id}
                  to={`/appointments/${appointment.id}`}
                  className="card block p-6 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-deep/10 text-deep rounded-xl font-bold text-center shrink-0">
                        <span className="text-xl sm:text-2xl leading-none">{day}</span>
                        <span className="text-xs uppercase">{month}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-main group-hover:text-deep transition-colors truncate">
                          {appointment.service.name}
                        </p>
                        <p className="text-sm text-main/60 mt-1 truncate">
                          {formatDateTime(appointment.start_date)} ({appointment.service.duration} dk)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      {appointment.staff && (
                        <div className="text-right hidden md:block max-w-[140px]">
                          <p className="text-xs text-main/40 uppercase tracking-wide">Personel</p>
                          <p className="text-sm font-medium text-main/80 truncate">
                            {appointment.staff.person.name} {appointment.staff.person.surname}
                          </p>
                        </div>
                      )}
                      <StatusBadge status={appointment.status.name} />
                      <ChevronRight className="h-5 w-5 text-main/15 group-hover:text-deep group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              )})}
            </div>

            {paginated && (
              <Pagination
                currentPage={paginated.current_page}
                lastPage={paginated.last_page}
                perPage={paginated.per_page}
                total={paginated.total}
                from={paginated.from}
                to={paginated.to}
                onPageChange={(p) => setPage(p)}
                onPerPageChange={(pp) => { setPerPage(pp); setPage(1); }}
              />
            )}
          </>
        )}
      </QueryGate>
    </div>
  );
}

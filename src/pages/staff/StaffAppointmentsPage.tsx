import { useState } from "react";
import { Link } from "react-router";
import { useStaffGetAppointmentsQuery } from "../../hooks/useAppointmentQueries";
import type { AppointmentFilters as ApptFilters } from "../../api/appointments";
import type { Appointment } from "../../other/types";
import StatusBadge from "../../components/StatusBadge";
import PageHeader from "../../components/PageHeader";
import QueryGate from "../../components/QueryGate";
import AppointmentFilters from "../admin/components/AppointmentFilters";
import Pagination from "../../components/Pagination";
import SortableTh from "../../components/SortableTh";
import { SkeletonTable } from "../../components/skeletons/SkeletonTableRow";
import { formatTime, formatDate } from "../../utils/dates";

export default function StaffAppointmentsPage() {
  const [tab, setTab] = useState<string>("");
  const [statusId, setStatusId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("start_date");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [perPage, setPerPage] = useState<number>(15);
  const [page, setPage] = useState<number>(1);

  const filters: ApptFilters = {
    ...(tab && { tab }),
    ...(statusId && { status_id: statusId }),
    ...(date && { date }),
    ...(customerName.trim() && { customer_name: customerName.trim() }),
    sort_by: sortBy,
    sort_order: sortOrder,
    per_page: perPage,
    page,
  };

  const { data: paginated, isLoading, isError } = useStaffGetAppointmentsQuery(filters);
  const appointments = paginated?.data ?? [];

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const clearFilters = () => {
    setTab("");
    setStatusId("");
    setDate("");
    setCustomerName("");
    setSortBy("start_date");
    setSortOrder("asc");
    setPage(1);
  };

  return (
    <div className="page-xl">
      <div className="mb-8">
        <PageHeader title="Randevularım" subtitle="Size atanmış randevuları buradan yönetin." />
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
          hasActiveFilters={!!(tab || statusId || date || customerName)}
        />
      </div>

      <QueryGate
        isLoading={isLoading}
        isError={isError}
        errorMessage="Randevular yüklenirken bir hata oluştu."
        loading={<SkeletonTable rows={6} columns={5} />}
      >
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-main/10 text-left text-sm">
              <thead className="bg-back">
                <tr>
                  <th className="table-cell font-semibold text-main/70 uppercase text-xs tracking-wider">Müşteri</th>
                  <SortableTh field="start_date" currentField={sortBy} currentOrder={sortOrder as "asc" | "desc"} onSort={handleSort}>
                    Tarih / Saat
                  </SortableTh>
                  <th className="table-cell font-semibold text-main/70 uppercase text-xs tracking-wider">Hizmet</th>
                  <SortableTh field="state_id" currentField={sortBy} currentOrder={sortOrder as "asc" | "desc"} onSort={handleSort}>
                    Durum
                  </SortableTh>
                  <th className="table-cell font-semibold text-main/70 uppercase text-xs tracking-wider text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-main/5">
                {appointments.length > 0 ? (
                  appointments.map((apt: Appointment) => (
                    <tr key={apt.id} className="hover:bg-back/50 transition-colors">
                      <td className="table-cell font-medium text-main whitespace-nowrap">
                        {apt.customer?.person.name} {apt.customer?.person.surname}
                      </td>
                      <td className="table-cell text-main/80">
                        <div>{formatDate(apt.start_date)}</div>
                        <div className="text-xs text-main/60">{formatTime(apt.start_date)} - {formatTime(apt.end_date)}</div>
                      </td>
                      <td className="table-cell text-main/80">{apt.service.name}</td>
                      <td className="table-cell"><StatusBadge status={apt.status.name} /></td>
                      <td className="table-cell text-right">
                        <Link to={`/staff/appointments/${apt.id}`} className="text-deep hover:text-deep/80 text-sm font-medium whitespace-nowrap">Detay / Güncelle</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="table-cell text-center text-main/60 py-8 sm:py-10">
                    {tab || statusId || date || customerName ? "Seçili filtrelerle eşleşen randevu bulunamadı." : "Size atanmış henüz bir randevu bulunmuyor."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
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
      </QueryGate>
    </div>
  );
}

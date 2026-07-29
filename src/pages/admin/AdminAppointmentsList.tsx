import { useState } from "react";
import { Link } from "react-router";
import {
  useAdminGetAppointmentsQuery,
  useAdminUpdateAppointmentMutation,
  useAdminDeleteAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useGetAllStaffQuery } from "../../hooks/useStaffQueries";
import type { Appointment } from "../../other/types";
import PageHeader from "../../components/PageHeader";
import QueryGate from "../../components/QueryGate";
import AppointmentFilters from "./components/AppointmentFilters";
import Pagination from "../../components/Pagination";
import SortableTh from "../../components/SortableTh";
import { SkeletonTable } from "../../components/skeletons/SkeletonTableRow";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../hooks/useToast";
import { STATUS_LABELS, STATUS_NAME_BY_ID } from "../../other/constants";
import type { AppointmentStatusId } from "../../other/constants";
import { formatDate, formatTime } from "../../utils/dates";
import { getErrorMessage } from "../../utils/errors";

// Mirrors AppointmentStateMachine on the backend: terminal statuses
// accept no further transitions.
const TERMINAL_STATUSES = new Set(["completed", "cancelled"]);

export default function AdminAppointmentsList() {
  const confirm = useConfirm();
  const toast = useToast();

  const [tab, setTab] = useState<string>("");
  const [statusId, setStatusId] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("start_date");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [perPage, setPerPage] = useState<number>(15);
  const [page, setPage] = useState<number>(1);

  // Filter setters that also reset pagination. Without this, the user
  // could be on page 5, change a filter that returns 2 pages, and
  // see an empty result.
  const setTabP = (v: string) => { setTab(v); setPage(1); };
  const setStatusIdP = (v: string) => { setStatusId(v); setPage(1); };
  const setStaffIdP = (v: string) => { setStaffId(v); setPage(1); };
  const setDateP = (v: string) => { setDate(v); setPage(1); };
  const setCustomerNameP = (v: string) => { setCustomerName(v); setPage(1); };

  const filters = {
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

  const { data: staffList } = useGetAllStaffQuery();
  const { data: paginated, isLoading, isError } = useAdminGetAppointmentsQuery(filters);
  // The mutation hooks now invalidate the cache automatically on
  // success — explicit invalidation here would just double-refresh.
  const updateMut = useAdminUpdateAppointmentMutation();
  const deleteMut = useAdminDeleteAppointmentMutation();

  const [changingId, setChangingId] = useState<number | null>(null);
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

  const handleStatusChange = async (appointmentId: number, newStateId: number) => {
    const targetName = STATUS_NAME_BY_ID[newStateId as AppointmentStatusId] ?? "";
    const targetLabel = STATUS_LABELS[targetName] ?? "bilinmiyor";
    const variant: "primary" | "success" | "danger" =
      newStateId === 3 ? "success" : newStateId === 4 ? "danger" : "primary";
    const ok = await confirm({
      title: "Durumu Güncelle",
      description: `Randevunun durumunu "${targetLabel}" olarak değiştirmek istediğinize emin misiniz?`,
      confirmLabel: "Evet, Güncelle",
      cancelLabel: "Vazgeç",
      variant,
    });
    if (!ok) return;
    setChangingId(appointmentId);
    try {
      await updateMut.mutateAsync({ id: appointmentId, data: { state_id: newStateId } });
      toast.success("Durum güncellendi.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Durum güncellenirken bir hata oluştu."));
    } finally {
      setChangingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      title: "Randevuyu Sil",
      description: "Bu randevuyu kalıcı olarak silmek istediğinize emin misiniz?",
      confirmLabel: "Evet, Sil",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Randevu silindi.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Randevu silinirken bir hata oluştu."));
    }
  };

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
    <div className="page-xl space-y-6">
      <PageHeader title="Randevular" subtitle="Tüm personel ve müşterilerin randevularını buradan yönetin." />

      <AppointmentFilters
        statusId={statusId}
        onStatusChange={setStatusIdP}
        date={date}
        onDateChange={setDateP}
        tab={tab}
        onTabChange={setTabP}
        customerName={customerName}
        onCustomerNameChange={setCustomerNameP}
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
          <select value={staffId} onChange={(e) => setStaffIdP(e.target.value)} className="input-filter focus:border-deep focus:ring-2 focus:ring-deep/20">
            <option value="">Tümü</option>
            {staffList?.data?.map((s) => (
              <option key={s.id} value={String(s.id)}>{s.person?.name} {s.person?.surname}</option>
            ))}
          </select>
        </div>
      </AppointmentFilters>

      <QueryGate
        isLoading={isLoading}
        isError={isError}
        errorMessage="Randevular yüklenirken hata oluştu."
        loading={<SkeletonTable rows={8} columns={5} />}
      >
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-main/10">
              <thead className="bg-back">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider">Müşteri / Personel</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider">Hizmet</th>
                  <SortableTh field="start_date" currentField={sortBy} currentOrder={sortOrder as "asc" | "desc"} onSort={handleSort}>
                    Tarih &amp; Saat
                  </SortableTh>
                  <SortableTh field="state_id" currentField={sortBy} currentOrder={sortOrder as "asc" | "desc"} onSort={handleSort}>
                    Durum
                  </SortableTh>
                  <th className="px-6 py-3 text-right text-xs font-bold text-main/60 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-main/5">
                {appointments.length > 0 ? (
                  appointments.map((appo: Appointment) => (
                    <tr key={appo.id} className="hover:bg-back transition-colors">
                      <td className="table-cell whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-main">{appo.customer?.person?.name} {appo.customer?.person?.surname}</span>
                          <span className="text-xs text-main/60">→ {appo.staff?.person?.name} {appo.staff?.person?.surname}</span>
                        </div>
                      </td>
                      <td className="table-cell whitespace-nowrap">
                        <div className="text-sm text-main">{appo.service.name}</div>
                        <div className="text-xs text-main/40">{appo.service.duration} dk</div>
                      </td>
                      <td className="table-cell whitespace-nowrap">
                        <div className="text-sm text-main">{formatDate(appo.start_date)}</div>
                        <div className="text-sm font-medium text-deep">{formatTime(appo.start_date)}</div>
                      </td>
                      <td className="table-cell whitespace-nowrap">
                        {changingId === appo.id ? (
                          <div className="spinner-sm"></div>
                        ) : (
                          <select
                            value={appo.state_id}
                            onChange={(e) => handleStatusChange(appo.id, Number(e.target.value))}
                            disabled={changingId !== null || TERMINAL_STATUSES.has(appo.status.name)}
                            // Once an appointment reaches a terminal
                            // state (completed/cancelled) the backend
                            // rejects any further status change. Lock
                            // the dropdown so the user can't trigger
                            // the 422 in the first place.
                            aria-label={`Randevu #${appo.id} durumunu güncelle`}
                            className={`badge badge-${appo.status.name} ${TERMINAL_STATUSES.has(appo.status.name) ? "cursor-not-allowed" : "cursor-pointer"} focus:ring-2 focus:ring-offset-1 disabled:opacity-70`}
                          >
                            <option value="1">Beklemede</option>
                            <option value="2">Onaylandı</option>
                            <option value="3">Tamamlandı</option>
                            <option value="4">İptal Edildi</option>
                          </select>
                        )}
                      </td>
                      <td className="table-cell whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/admin/appointments/${appo.id}`} className="text-deep hover:text-deep/80 mr-4">Detay</Link>
                        <button onClick={() => handleDelete(appo.id)} disabled={deleteMut.isPending} className="text-canceld hover:text-canceld/80 disabled:text-main/40">Sil</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-main/60">Seçili filtrelerle eşleşen randevu bulunamadı.</td></tr>
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

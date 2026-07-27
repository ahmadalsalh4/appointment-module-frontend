import { useState } from "react";
import { Link } from "react-router";
import {
  useAdminGetAppointmentsQuery,
  useAdminUpdateStateMutation,
  useAdminDeleteAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useGetAllStaffQuery } from "../../hooks/useStaffQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { Appointment } from "../../other/types";
import PageHeader from "../../components/PageHeader";
import { formatDate, formatTime } from "../../utils/dates";

export default function AdminAppointmentsList() {
  const queryClient = useQueryClient();

  // Filtre state'leri
  const [statusId, setStatusId] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");

  const filters = {
    ...(statusId && { status_id: statusId }),
    ...(staffId && { staff_id: staffId }),
    ...(date && { date }),
    ...(customerName.trim() && { customer_name: customerName.trim() }),
  };

  const { data: staffList } = useGetAllStaffQuery();

  const {
    data: appointments,
    isLoading,
    isError,
  } = useAdminGetAppointmentsQuery(filters);
  const updateStateMut = useAdminUpdateStateMutation();
  const deleteMut = useAdminDeleteAppointmentMutation();

  const [changingId, setChangingId] = useState<number | null>(null);

  const handleStatusChange = async (
    appointmentId: number,
    newStateId: number,
  ) => {
    setChangingId(appointmentId);
    try {
      await updateStateMut.mutateAsync({
        id: appointmentId,
        data: { state_id: newStateId },
      });
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
    } catch {
      alert("Durum güncellenirken hata oluştu.");
    } finally {
      setChangingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bu randevuyu silmek istediğinize emin misiniz?"))
      return;
    try {
      await deleteMut.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
    } catch {
      alert("Randevu silinirken hata oluştu.");
    }
  };

  const clearFilters = () => {
    setStatusId("");
    setStaffId("");
    setDate("");
    setCustomerName("");
  };

  if (isLoading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-canceld">
        <p className="text-xl font-bold">Randevular yüklenirken hata oluştu.</p>
      </div>
    );
  }

  return (
    <div className="page-xl space-y-6">
      <PageHeader
        title="Randevular"
        subtitle="Tüm personel ve müşterilerin randevularını buradan yönetin."
      />

      {/* Filtreler */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Müşteri adı arama */}
          <div className="lg:col-span-2">
              <label className="label-sm">
              Müşteri Ara
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ad veya soyad..."
              className="input-filter focus:border-deep focus:ring-2 focus:ring-deep/20"
            />
          </div>

          {/* Durum filtresi */}
          <div>
              <label className="label-sm">
              Durum
            </label>
            <select
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              className="input-filter focus:border-deep focus:ring-2 focus:ring-deep/20"
            >
              <option value="">Tümü</option>
              <option value="1">Beklemede</option>
              <option value="2">Onaylandı</option>
              <option value="3">Tamamlandı</option>
              <option value="4">İptal Edildi</option>
            </select>
          </div>

          {/* Personel filtresi */}
          <div>
              <label className="label-sm">
              Personel
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="input-filter focus:border-deep focus:ring-2 focus:ring-deep/20"
            >
              <option value="">Tümü</option>
              {staffList?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.person?.name} {s.person?.surname}
                </option>
              ))}
            </select>
          </div>

          {/* Tarih filtresi */}
          <div>
              <label className="label-sm">
              Tarih
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-filter focus:border-deep focus:ring-2 focus:ring-deep/20"
            />
          </div>
        </div>

        {(statusId || staffId || date || customerName) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-deep hover:underline"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-main/10">
            <thead className="bg-back">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider"
                >
                  Müşteri / Personel
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider"
                >
                  Hizmet
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider"
                >
                  Tarih & Saat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-main/60 uppercase tracking-wider"
                >
                  Durum
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-bold text-main/60 uppercase tracking-wider"
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-main/5">
              {appointments && appointments.length > 0 ? (
                appointments.map((appo: Appointment) => (
                  <tr
                    key={appo.id}
                    className="hover:bg-back transition-colors"
                  >
                    {/* Customer & Staff Info */}
                    <td className="table-cell whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-main">
                          {appo.customer?.person.name}{" "}
                          {appo.customer?.person.surname}
                        </span>
                        <span className="text-xs text-main/60">
                          → {appo.staff?.person.name}{" "}
                          {appo.staff?.person.surname}
                        </span>
                      </div>
                    </td>

                    {/* Service Info */}
                    <td className="table-cell whitespace-nowrap">
                      <div className="text-sm text-main">
                        {appo.service.name}
                      </div>
                      <div className="text-xs text-main/40">
                        {appo.service.duration} dk
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="table-cell whitespace-nowrap">
                      <div className="text-sm text-main">
                        {formatDate(appo.start_date)}
                      </div>
                      <div className="text-sm font-medium text-deep">
                        {formatTime(appo.start_date)}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="table-cell whitespace-nowrap">
                      {changingId === appo.id ? (
                        <div className="spinner-sm"></div>
                      ) : (
                        <select
                          value={appo.state_id}
                          onChange={(e) =>
                            handleStatusChange(appo.id, Number(e.target.value))
                          }
                          className={`badge badge-${appo.status.name} cursor-pointer focus:ring-2 focus:ring-offset-1`}
                        >
                          <option value="1">Beklemede</option>
                          <option value="2">Onaylandı</option>
                          <option value="3">Tamamlandı</option>
                          <option value="4">İptal Edildi</option>
                        </select>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="table-cell whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/appointments/${appo.id}`}
                        className="text-deep hover:text-deep/80 mr-4"
                      >
                        Detay
                      </Link>
                      <button
                        onClick={() => handleDelete(appo.id)}
                        disabled={deleteMut.isPending}
                        className="text-canceld hover:text-canceld/80 disabled:text-main/40"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-main/60"
                  >
                    Seçili filtrelerle eşleşen randevu bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

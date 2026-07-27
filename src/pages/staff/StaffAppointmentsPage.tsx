import { useState } from "react";
import { Link } from "react-router";
import { useStaffGetAppointmentsQuery } from "../../hooks/useAppointmentQueries";
import type { AppointmentFilters } from "../../api/appointments";
import type { Appointment } from "../../other/types";
import StatusBadge from "../../components/StatusBadge";
import PageHeader from "../../components/PageHeader";
import { formatTime, formatDate } from "../../utils/dates";

export default function StaffAppointmentsPage() {
  const [statusId, setStatusId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");

  const filters: AppointmentFilters = {
    ...(statusId && { status_id: statusId }),
    ...(date && { date }),
    ...(customerName.trim() && { customer_name: customerName.trim() }),
  };

  const { data: appointments, isLoading, isError } =
    useStaffGetAppointmentsQuery(filters);

  const clearFilters = () => {
    setStatusId("");
    setDate("");
    setCustomerName("");
  };

  if (isLoading) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-wide text-center text-canceld">
        <p className="text-xl font-bold">
          Randevular yüklenirken bir hata oluştu.
        </p>
      </div>
    );
  }

  return (
    <div className="page-xl">
      <div className="mb-8">
        <PageHeader
          title="Randevularım"
          subtitle="Size atanmış randevuları buradan yönetin."
        />
      </div>

      {/* Filtreler */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

        {(statusId || date || customerName) && (
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

      {/* TABLO */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-main/10 text-left text-sm">
            <thead className="bg-back">
              <tr>
                <th className="table-cell font-semibold text-main/70 uppercase text-xs tracking-wider">
                  Müşteri
                </th>
                <th className="table-cell font-semibold text-main/70 uppercase text-xs tracking-wider">
                  Tarih / Saat
                </th>
                <th className="table-cell font-semibold text-main/70 uppercase text-xs tracking-wider">
                  Hizmet
                </th>
                <th className="table-cell font-semibold text-main/70 uppercase text-xs tracking-wider">
                  Durum
                </th>
                <th className="table-cell font-semibold text-main/70 uppercase text-xs tracking-wider text-right">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-main/5">
              {appointments && appointments.length > 0 ? (
                appointments.map((apt: Appointment) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-back/50 transition-colors"
                  >
                    <td className="table-cell font-medium text-main whitespace-nowrap">
                      {apt.customer?.person.name} {apt.customer?.person.surname}
                    </td>
                    <td className="table-cell text-main/80">
                      <div>{formatDate(apt.start_date)}</div>
                      <div className="text-xs text-main/60">
                        {formatTime(apt.start_date)} - {formatTime(apt.end_date)}
                      </div>
                    </td>
                    <td className="table-cell text-main/80">
                      {apt.service.name}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={apt.status.name} />
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/staff/appointments/${apt.id}`}
                        className="text-deep hover:text-deep/80 text-sm font-medium whitespace-nowrap"
                      >
                        Detay / Güncelle
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="table-cell text-center text-main/60 py-8 sm:py-10"
                  >
                    {statusId || date || customerName
                      ? "Seçili filtrelerle eşleşen randevu bulunamadı."
                      : "Size atanmış henüz bir randevu bulunmuyor."}
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

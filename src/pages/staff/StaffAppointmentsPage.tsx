import { useState } from "react";
import { Link } from "react-router";
import { useStaffGetAppointmentsQuery } from "../../hooks/useAppointmentQueries";
import type { AppointmentFilters as ApptFilters } from "../../api/appointments";
import type { Appointment } from "../../other/types";
import StatusBadge from "../../components/StatusBadge";
import PageHeader from "../../components/PageHeader";
import QueryGate from "../../components/QueryGate";
import AppointmentFilters from "../admin/components/AppointmentFilters";
import { formatTime, formatDate } from "../../utils/dates";

export default function StaffAppointmentsPage() {
  const [statusId, setStatusId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");

  const filters: ApptFilters = {
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

  return (
    <div className="page-xl">
      <div className="mb-8">
        <PageHeader
          title="Randevularım"
          subtitle="Size atanmış randevuları buradan yönetin."
        />
      </div>

      <div className="mb-6">
        <AppointmentFilters
          statusId={statusId}
          onStatusChange={setStatusId}
          date={date}
          onDateChange={setDate}
          customerName={customerName}
          onCustomerNameChange={setCustomerName}
          onClear={clearFilters}
          hasActiveFilters={!!(statusId || date || customerName)}
          showCustomerSearch
        />
      </div>

      <QueryGate isLoading={isLoading} isError={isError} errorMessage="Randevular yüklenirken bir hata oluştu.">
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
      </QueryGate>
    </div>
  );
}

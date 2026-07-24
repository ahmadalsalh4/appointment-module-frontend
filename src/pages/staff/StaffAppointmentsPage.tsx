import { useState } from "react";
import { Link } from "react-router";
import { useStaffGetAppointmentsQuery } from "../../hooks/useAppointmentQueries";
import type { AppointmentFilters } from "../../api/appointments";
import type { Appointment } from "../../other/types";

const getStatusStyle = (statusName: string) => {
  switch (statusName) {
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
    case "confirmed":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    case "completed":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
    case "cancelled":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300";
  }
};

const getStatusLabel = (statusName: string) => {
  switch (statusName) {
    case "pending":
      return "Beklemede";
    case "confirmed":
      return "Onaylandı";
    case "completed":
      return "Tamamlandı";
    case "cancelled":
      return "İptal Edildi";
    default:
      return statusName;
  }
};

const formatTime = (isoDate: string) => {
  const timePart = isoDate.split("T")[1];
  if (!timePart) return "";
  return timePart.split(".")[0].split(":").slice(0, 2).join(":");
};

const formatDate = (isoDate: string) => {
  const datePart = isoDate.split("T")[0];
  return new Date(datePart + "T00:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500 dark:text-red-400">
        <p className="text-xl font-bold">
          Randevular yüklenirken bir hata oluştu.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-wrap-balance">
          Randevularım
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          Size atanmış randevuları buradan yönetin.
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Müşteri Ara
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ad veya soyad..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Durum
            </label>
            <select
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Tümü</option>
              <option value="1">Beklemede</option>
              <option value="2">Onaylandı</option>
              <option value="3">Tamamlandı</option>
              <option value="4">İptal Edildi</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Tarih
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {(statusId || date || customerName) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* TABLO */}
      <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                  Müşteri
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                  Tarih / Saat
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                  Hizmet
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                  Durum
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider text-right">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {appointments && appointments.length > 0 ? (
                appointments.map((apt: Appointment) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {apt.customer?.person.name} {apt.customer?.person.surname}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 dark:text-gray-300">
                      <div>{formatDate(apt.start_date)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(apt.start_date)} - {formatTime(apt.end_date)}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700 dark:text-gray-300">
                      {apt.service.name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusStyle(apt.status.name)}`}
                      >
                        {getStatusLabel(apt.status.name)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <Link
                        to={`/staff/appointments/${apt.id}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium whitespace-nowrap"
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
                    className="px-3 sm:px-6 py-8 sm:py-10 text-center text-gray-500 dark:text-gray-400"
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

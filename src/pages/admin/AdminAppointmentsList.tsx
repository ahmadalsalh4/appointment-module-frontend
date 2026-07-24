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

// Zaman formatlayıcı (Saat dilimi kaymasını önler)
const formatSafeTime = (isoString: string) => {
  return (
    isoString.split("T")[1]?.split(".")[0].split(":").slice(0, 2).join(":") ||
    ""
  );
};

const formatSafeDate = (isoString: string) => {
  const datePart = isoString.split("T")[0];
  return new Date(datePart + "T00:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Durum etiketleri
const getStatusStyle = (statusName: string) => {
  switch (statusName) {
    case "confirmed":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    case "completed":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
    case "cancelled":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
    case "pending":
    default:
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
  }
};

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500 dark:text-red-400">
        <p className="text-xl font-bold">Randevular yüklenirken hata oluştu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-wrap-balance">Randevular</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
            Tüm personel ve müşterilerin randevularını buradan yönetin.
          </p>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Müşteri adı arama */}
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

          {/* Durum filtresi */}
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

          {/* Personel filtresi */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Personel
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

        {(statusId || staffId || date || customerName) && (
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

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Müşteri / Personel
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Hizmet
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Tarih & Saat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Durum
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {appointments && appointments.length > 0 ? (
                appointments.map((appo: Appointment) => (
                  <tr
                    key={appo.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Customer & Staff Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {appo.customer?.person.name}{" "}
                          {appo.customer?.person.surname}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          → {appo.staff?.person.name}{" "}
                          {appo.staff?.person.surname}
                        </span>
                      </div>
                    </td>

                    {/* Service Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {appo.service.name}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {appo.service.duration} dk
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatSafeDate(appo.start_date)}
                      </div>
                      <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {formatSafeTime(appo.start_date)}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {changingId === appo.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      ) : (
                        <select
                          value={appo.state_id}
                          onChange={(e) =>
                            handleStatusChange(appo.id, Number(e.target.value))
                          }
                          className={`text-xs font-bold uppercase rounded-full px-3 py-1.5 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 ${getStatusStyle(appo.status.name)}`}
                        >
                          <option value="1">Beklemede</option>
                          <option value="2">Onaylandı</option>
                          <option value="3">Tamamlandı</option>
                          <option value="4">İptal Edildi</option>
                        </select>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/appointments/${appo.id}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                      >
                        Detay
                      </Link>
                      <button
                        onClick={() => handleDelete(appo.id)}
                        disabled={deleteMut.isPending}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:text-gray-400 dark:disabled:text-gray-500"
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
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
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

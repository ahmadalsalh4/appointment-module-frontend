import  { useState } from "react";
import { Link } from "react-router";
import {
  useAdminGetAppointmentsQuery,
  useAdminUpdateStateMutation,
  useAdminDeleteAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
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
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const getStatusText = (statusName: string) => {
  switch (statusName) {
    case "confirmed":
      return "Onaylandı";
    case "completed":
      return "Tamamlandı";
    case "cancelled":
      return "İptal Edildi";
    case "pending":
    default:
      return "Beklemede";
  }
};

export default function AdminAppointmentsList() {
  const queryClient = useQueryClient();
  const {
    data: appointments,
    isLoading,
    isError,
  } = useAdminGetAppointmentsQuery();
  const updateStateMut = useAdminUpdateStateMutation();
  const deleteMut = useAdminDeleteAppointmentMutation();

  // Table state for sorting/filtering later if needed
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
    } catch (err) {
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
    } catch (err) {
      alert("Randevu silinirken hata oluştu.");
    }
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
      <div className="text-center py-20 text-red-500">
        <p className="text-xl font-bold">Randevular yüklenirken hata oluştu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Randevular</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Tüm personel ve müşterilerin randevularını buradan yönetin.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Müşteri / Personel
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Hizmet
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Tarih & Saat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Durum
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {appointments && appointments.length > 0 ? (
                appointments.map((appo: Appointment) => (
                  <tr
                    key={appo.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Customer & Staff Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {appo.customer?.person.name}{" "}
                          {appo.customer?.person.surname}
                        </span>
                        <span className="text-xs text-gray-500">
                          → {appo.staff?.person.name}{" "}
                          {appo.staff?.person.surname}
                        </span>
                      </div>
                    </td>

                    {/* Service Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appo.service.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {appo.service.duration} dk
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatSafeDate(appo.start_date)}
                      </div>
                      <div className="text-sm font-medium text-indigo-600">
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
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Detay
                      </Link>
                      <button
                        onClick={() => handleDelete(appo.id)}
                        disabled={deleteMut.isPending}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400"
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
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Sistemde henüz hiçbir randevu bulunmuyor.
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

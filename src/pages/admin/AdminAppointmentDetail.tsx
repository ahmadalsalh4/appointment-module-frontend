import React from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  useAdminGetAppointmentByIdQuery,
  useAdminUpdateStateMutation,
  useAdminDeleteAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useQueryClient } from "@tanstack/react-query";

// Zaman formatlayıcılar (Saat dilimi kaymasını önler)
const formatSafeTime = (isoString: string) => {
  return (
    isoString.split("T")[1]?.split(".")[0].split(":").slice(0, 2).join(":") ||
    ""
  );
};

const formatSafeDate = (isoString: string) => {
  const datePart = isoString.split("T")[0];
  return new Date(datePart + "T00:00:00").toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Durum renkleri
const getStatusStyle = (statusName: string) => {
  switch (statusName) {
    case "confirmed":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
    case "completed":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "cancelled":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
    case "pending":
    default:
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
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
      return "Onay Bekliyor";
  }
};

export default function AdminAppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: appointment,
    isLoading,
    isError,
  } = useAdminGetAppointmentByIdQuery(id || "");
  const updateStateMut = useAdminUpdateStateMutation();
  const deleteMut = useAdminDeleteAppointmentMutation();

  const handleStatusUpdate = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStateId = Number(e.target.value);
    try {
      await updateStateMut.mutateAsync({
        id: id!,
        data: { state_id: newStateId },
      });
      queryClient.invalidateQueries({
        queryKey: ["appointments", "admin", id],
      });
    } catch {
      alert("Durum güncellenirken bir hata oluştu.");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Bu randevuyu kalıcı olarak silmek istediğinize emin misiniz?",
      )
    )
      return;
    try {
      await deleteMut.mutateAsync(id!);
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      navigate("/admin/appointments"); // Listeye geri dön
    } catch {
      alert("Randevu silinirken bir hata oluştu.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !appointment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500 dark:text-red-400">
        <p className="text-xl font-bold">Randevu bulunamadı.</p>
        <Link
          to="/admin/appointments"
          className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Randevulara Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/admin/appointments" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Randevular
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">#{appointment.id}</span>
      </nav>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header Status Bar */}
        <div
          className={`p-4 sm:p-6 border-b ${getStatusStyle(appointment.status.name)}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                Mevcut Durum
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-wrap-balance">
                {getStatusText(appointment.status.name)}
              </h1>
            </div>

            {/* Admin Action: Status Change Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase opacity-80">
                Durumu Güncelle
              </label>
              <select
                value={appointment.state_id}
                onChange={handleStatusUpdate}
                disabled={updateStateMut.isPending}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-100 dark:disabled:bg-gray-600"
              >
                <option value="1">Beklemede</option>
                <option value="2">Onaylandı</option>
                <option value="3">Tamamlandı</option>
                <option value="4">İptal Edildi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT: Appointment Details */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2 mb-4">
                Randevu Detayları
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tarih ve Saat</p>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">
                      {formatSafeDate(appointment.start_date)}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatSafeTime(appointment.start_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hizmet ve Süre</p>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">
                      {appointment.service.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.service.duration} Dakika
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            {appointment.customer && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2 mb-4">
                  Müşteri Bilgileri
                </h2>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xl font-bold">
                    {appointment.customer.person.name.charAt(0)}
                    {appointment.customer.person.surname.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 font-bold truncate">
                      {appointment.customer.person.name}{" "}
                      {appointment.customer.person.surname}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
                      {appointment.customer.email}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 break-words">
                      {appointment.customer.person.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Staff Info & Danger Zone */}
          <div className="space-y-8">
            {/* Staff Info */}
            {appointment.staff && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2 mb-4">
                  Personel Bilgileri
                </h2>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl font-bold">
                    {appointment.staff.person.name.charAt(0)}
                    {appointment.staff.person.surname.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 font-bold truncate">
                      {appointment.staff.person.name}{" "}
                      {appointment.staff.person.surname}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.staff.job_title}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 break-words">
                      {appointment.staff.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="mt-auto">
              <h2 className="text-lg font-bold text-red-600 dark:text-red-400 border-b border-red-100 dark:border-red-800 pb-2 mb-4">
                Tehlikeli Alan
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Bu randevuyu silmek geri alınamaz. Müşteri ve personel
                  bilgilendirilmeyecektir.
                </p>
                <button
                  onClick={handleDelete}
                  disabled={deleteMut.isPending}
                  className="w-full px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center justify-center gap-2"
                >
                  {deleteMut.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Siliniyor...
                    </>
                  ) : (
                    "Randevuyu Sil"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

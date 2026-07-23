import { useParams, Link, useNavigate } from "react-router";
import {
  useCustomerGetAppointmentByIdQuery,
  useCancelAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useQueryClient } from "@tanstack/react-query";

// REPLACE your old formatDateTime function with this one:

const formatDateTime = (isoString: string) => {
  // 1. Split date and time
  const [datePart, timePart] = isoString.split("T");

  // 2. Remove milliseconds/Z, THEN split by ':' to get hours and minutes
  // "15:45:00" -> ["15", "45", "00"] -> "15:45"
  const timeWithoutSeconds = timePart
    .split(".")[0]
    .split(":")
    .slice(0, 2)
    .join(":");

  // 3. Format the date safely
  const dateObj = new Date(datePart + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 4. Combine
  return `${formattedDate} - ${timeWithoutSeconds}`;
};

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

export default function MyAppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: appointment,
    isLoading,
    isError,
  } = useCustomerGetAppointmentByIdQuery(id || "");
  const cancelMutation = useCancelAppointmentMutation();

  const handleCancel = async () => {
    if (!window.confirm("Randevunuzu iptal etmek istediğinize emin misiniz?"))
      return;

    try {
      await cancelMutation.mutateAsync(id!);
      queryClient.invalidateQueries({ queryKey: ["appointments", "customer"] });
      navigate("/appointments"); // Redirect back to list
    } catch {
      alert("Randevu iptal edilirken bir hata oluştu.");
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
          to="/appointments"
          className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Randevularıma Dön
        </Link>
      </div>
    );
  }

  const isCancellable =
    appointment.status.name === "pending" ||
    appointment.status.name === "confirmed";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/appointments" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Randevularım
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">#{appointment.id}</span>
      </nav>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header Status Bar */}
        <div
          className={`p-4 sm:p-6 border-b ${getStatusStyle(appointment.status.name)}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                Durum
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                {getStatusText(appointment.status.name)}
              </h1>
            </div>
            {isCancellable && (
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="self-start sm:self-center px-6 py-2.5 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 font-bold rounded-lg shadow-sm border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500"
              >
                {cancelMutation.isPending
                  ? "İptal Ediliyor..."
                  : "Randevuyu İptal Et"}
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Appointment Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
              Randevu Detayları
            </h2>

            <div className="flex items-start gap-4">
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
                  {formatDateTime(appointment.start_date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
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
                  {appointment.service.name}{" "}
                  <span className="text-gray-400 dark:text-gray-500 font-normal">
                    ({appointment.service.duration} dk)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Staff Details */}
          {appointment.staff && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2">
                Personel Bilgileri
              </h2>
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xl font-bold">
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
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {appointment.staff.person.phone_number}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

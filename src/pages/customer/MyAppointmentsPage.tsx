import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  useCustomerGetAppointmentsQuery,
} from "../../hooks/useAppointmentQueries";
import type { AppointmentFilters } from "../../api/appointments";

const formatDateTime = (isoString: string) => {
  const [datePart, timePart] = isoString.split("T");

  const timeWithoutSeconds = timePart
    .split(".")[0]
    .split(":")
    .slice(0, 2)
    .join(":");

  const dateObj = new Date(datePart + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${formattedDate} - ${timeWithoutSeconds}`;
};

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

export default function MyAppointmentsPage() {
  const [statusId, setStatusId] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const filters: AppointmentFilters = {
    ...(statusId && { status_id: statusId }),
    ...(staffId && { staff_id: staffId }),
    ...(date && { date }),
  };

  // Herhangi bir filtre uygulanmamışken personelleri türet — böylece dropdown tüm
  // personeli gösterir. Filtre uygulandığında sadece kalan personeller görünür.
  const allParams = useMemo(() => ({} as AppointmentFilters), []);

  const {
    data: allAppointments,
  } = useCustomerGetAppointmentsQuery(allParams);

  const {
    data: appointments,
    isLoading,
    isError,
  } = useCustomerGetAppointmentsQuery(filters);

  // Müşterinin randevu geçmişindeki benzersiz personeller
  const staffOptions = useMemo(() => {
    const map = new Map<
      number,
      { id: number; name: string; surname: string }
    >();
    for (const apt of allAppointments ?? []) {
      if (apt.staff) {
        map.set(apt.staff.id, {
          id: apt.staff.id,
          name: apt.staff.person?.name ?? "",
          surname: apt.staff.person?.surname ?? "",
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`, "tr")
    );
  }, [allAppointments]);

  const clearFilters = () => {
    setStatusId("");
    setStaffId("");
    setDate("");
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
          Randevularınız yüklenirken bir hata oluştu.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-wrap-balance">
            Randevularım
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Geçmiş ve yaklaşan randevularınızı burada yönetin.
          </p>
        </div>
        <Link
          to="/services"
          className="self-start sm:self-auto inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Yeni Randevu
        </Link>
      </div>

      {/* Filtreler */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              Personel
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Tümü</option>
              {staffOptions.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name} {s.surname}
                </option>
              ))}
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
          <div className="flex items-end">
            {(statusId || staffId || date) && (
              <button
                onClick={clearFilters}
                className="w-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline py-2"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        </div>
      </div>

      {appointments && appointments.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
            {statusId || staffId || date
              ? "Seçili filtrelerle eşleşen randevu bulunamadı."
              : "Henüz bir randevunuz bulunmuyor."}
          </p>
          {!statusId && !staffId && !date && (
            <Link
              to="/services"
              className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              İlk randevunuzu oluşturun
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments?.map((appointment) => (
            <Link
              key={appointment.id}
              to={`/appointments/${appointment.id}`}
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold text-center shrink-0">
                    <span className="text-xl sm:text-2xl leading-none">
                      {new Date(appointment.start_date).getDate()}
                    </span>
                    <span className="text-xs uppercase">
                      {new Date(appointment.start_date).toLocaleString(
                        "tr-TR",
                        { month: "short" },
                      )}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {appointment.service.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {formatDateTime(appointment.start_date)} (
                      {appointment.service.duration} dk)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  {appointment.staff && (
                    <div className="text-right hidden md:block max-w-[140px]">
                      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                        Personel
                      </p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                        {appointment.staff.person.name}{" "}
                        {appointment.staff.person.surname}
                      </p>
                    </div>
                  )}

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyle(appointment.status.name)}`}
                  >
                    {getStatusText(appointment.status.name)}
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { Link } from "react-router";
import { useCustomerGetAppointmentsQuery } from "../../hooks/useAppointmentQueries";

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

// Badge colors based on appointment state
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

export default function MyAppointmentsPage() {
  const {
    data: appointments,
    isLoading,
    isError,
  } = useCustomerGetAppointmentsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500">
        <p className="text-xl font-bold">
          Randevularınız yüklenirken bir hata oluştu.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Randevularım
          </h1>
          <p className="mt-1 text-gray-500">
            Geçmiş ve yaklaşan randevularınızı burada yönetin.
          </p>
        </div>
        <Link
          to="/services"
          className="hidden sm:inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Yeni Randevu
        </Link>
      </div>

      {appointments && appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-16 w-16 text-gray-300"
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
          <p className="mt-4 text-gray-500 text-lg">
            Henüz bir randevunuz bulunmuyor.
          </p>
          <Link
            to="/services"
            className="mt-4 inline-block text-indigo-600 font-semibold hover:underline"
          >
            İlk randevunuzu oluşturun
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments?.map((appointment) => (
            <Link
              key={appointment.id}
              to={`/appointments/${appointment.id}`}
              className="block bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Date & Time */}
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-center">
                    <span className="text-2xl leading-none">
                      {new Date(appointment.start_date).getDate()}
                    </span>
                    <span className="text-xs uppercase">
                      {new Date(appointment.start_date).toLocaleString(
                        "tr-TR",
                        { month: "short" },
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {appointment.service.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDateTime(appointment.start_date)} (
                      {appointment.service.duration} dk)
                    </p>
                  </div>
                </div>

                {/* Right: Staff & Status */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {appointment.staff && (
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Personel
                      </p>
                      <p className="text-sm font-medium text-gray-700">
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
                    className="h-5 w-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
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

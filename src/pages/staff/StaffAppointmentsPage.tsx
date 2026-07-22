import { useState } from "react";
import { Link } from "react-router";
import Loading from "../components/Loading";
import Error from "../components/Error";
import type {
  StaffAppointmentsFilters,
  StaffAppointment,
} from "../../other/typesold";

// Durum isimlerini Türkçeye çeviren ve renk veren fonksiyon
const getStatusStyle = (statusName: string) => {
  switch (statusName) {
    case "pending":
      return "bg-waiting/10 text-waiting";
    case "confirmed":
      return "bg-deep/10 text-deep";
    case "completed":
      return "bg-completed/10 text-completed";
    case "cancelled":
      return "bg-canceld/10 text-canceld";
    default:
      return "bg-main/10 text-main";
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

// Zaman formatlayıcı (15:00:00 -> 15:00)
const formatTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Tarih formatlayıcı
const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function StaffAppointmentsPage() {
  const [filters, setFilters] = useState<StaffAppointmentsFilters>({});
  const {
    data: appointments,
    isPending,
    isError,
    error,
  } = useStaffAppointments(filters);

  const handleFilter = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setFilters({
      date: (formData.get("date") as string) || undefined,
      customer_name: (formData.get("customer_name") as string) || undefined,
      status_id: (formData.get("status_id") as string) || undefined,
    });
  };

  if (isPending) return <Loading message="Randevular yükleniyor..." />;
  if (isError) return <Error message={error?.response?.data?.message} />;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-main">Randevularım</h1>

      {/* FİLTRELEME FORMU */}
      <form
        onSubmit={handleFilter}
        className="mb-8 grid grid-cols-1 gap-4 rounded-xl bg-surface p-6 shadow-sm border border-main/10 sm:grid-cols-4"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-main/70">
            Tarih
          </label>
          <input
            name="date"
            type="date"
            className="w-full rounded-lg border border-main/20 bg-back px-3 py-2 text-sm text-main outline-none focus:border-deep"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-main/70">
            Müşteri Adı
          </label>
          <input
            name="customer_name"
            type="text"
            placeholder="ahmad..."
            className="w-full rounded-lg border border-main/20 bg-back px-3 py-2 text-sm text-main outline-none focus:border-deep"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-main/70">
            Durum
          </label>
          <select
            name="status_id"
            className="w-full rounded-lg border border-main/20 bg-back px-3 py-2 text-sm text-main outline-none focus:border-deep"
          >
            <option value="">Tümü</option>
            <option value="1">Beklemede</option>
            <option value="2">Onaylandı</option>
            <option value="3">Tamamlandı</option>
            <option value="4">İptal Edildi</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-deep py-2 text-sm font-semibold text-surface hover:bg-deep/90"
          >
            Filtrele
          </button>
        </div>
      </form>

      {/* TABLO */}
      <div className="overflow-hidden rounded-xl bg-surface shadow-sm border border-main/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-main/10 bg-back/50">
            <tr>
              <th className="px-6 py-4 font-medium text-main/70">Müşteri</th>
              <th className="px-6 py-4 font-medium text-main/70">
                Tarih / Saat
              </th>
              <th className="px-6 py-4 font-medium text-main/70">Hizmet</th>
              <th className="px-6 py-4 font-medium text-main/70">Durum</th>
              <th className="px-6 py-4 font-medium text-main/70">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-main/10">
            {/* Eğer API direkt array döndürüyorsa .data?.data yerine sadece .data kullanıyoruz */}
            {appointments?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-main/50">
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              appointments?.map((apt: StaffAppointment) => (
                <tr key={apt.id} className="hover:bg-back/30 transition">
                  <td className="px-6 py-4 font-medium text-main">
                    {apt.customer.person.name} {apt.customer.person.surname}
                  </td>
                  <td className="px-6 py-4 text-main/80">
                    <div>{formatDate(apt.start_date)}</div>
                    <div className="text-xs text-main/50">
                      {formatTime(apt.start_date)} - {formatTime(apt.end_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-main/80">{apt.service.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(apt.status.name)}`}
                    >
                      {getStatusLabel(apt.status.name)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/staff/appointments/${apt.id}`}
                      className="text-deep hover:underline text-sm font-medium"
                    >
                      Detay / Güncelle
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useStaffGetAppointmentByIdQuery,
  useStaffUpdateStateMutation,
} from "../../hooks/useAppointmentQueries";

import Loading from "../components/Loading";
import Error from "../components/Error";

// Zaman formatlayıcı (15:45:00.000000Z -> 15:45)
const formatTime = (isoDate: string) => {
  const timePart = isoDate.split("T")[1]; // "15:45:00.000000Z" alır
  if (!timePart) return "";
  // Milisaniyeleri at, saat:dakikaayı al
  return timePart.split(".")[0].split(":").slice(0, 2).join(":");
};

// Tarih formatlayıcı (2026-07-23T15:00:00.000000Z -> 23 Temmuz 2026)
const formatDate = (isoDate: string) => {
  const datePart = isoDate.split("T")[0]; // "2026-07-23" alır
  // Saat kısmını "T00:00:00" yaparak JavaScript'in saat kayması yapmasını engelleriz
  return new Date(datePart + "T00:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function StaffAppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: apt,
    isPending,
    isError,
    error,
  } = useStaffGetAppointmentByIdQuery(Number(id));
  const updateStatus = useStaffUpdateStateMutation();

  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleUpdateStatus = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!selectedStatus || !id) return;

    updateStatus.mutate(
      { id: Number(id), data: { state_id: Number(selectedStatus) } },
      { onSuccess: () => navigate("/staff") },
    );
  };

  if (isPending) return <Loading message="Randevu detayı yükleniyor..." />;
  if (isError) return <Error message={error?.response?.data?.message} />;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-main/70 hover:text-main transition"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Listeye Dön
      </button>

      <div className="rounded-2xl bg-surface shadow-sm border border-main/10 overflow-hidden">
        {/* ÜST BAR: Durum Güncelleme */}
        <div className="flex flex-col gap-4 border-b border-main/10 bg-back/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-main">Randevu # {apt?.id}</h1>

          <form
            onSubmit={handleUpdateStatus}
            className="flex items-center gap-2"
          >
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-main/20 bg-surface px-3 py-2 text-sm text-main outline-none focus:border-deep"
            >
              <option value="">Durum Seçin</option>
              <option value="2">Onaylandı</option>
              <option value="3">Tamamlandı</option>
            </select>
            <button
              type="submit"
              disabled={updateStatus.isPending || !selectedStatus}
              className="rounded-lg bg-deep px-4 py-2 text-sm font-semibold text-surface hover:bg-deep/90 disabled:opacity-50 transition"
            >
              {updateStatus.isPending ? "Kaydediliyor..." : "Güncelle"}
            </button>
          </form>
        </div>

        {/* DETAY BİLGİLERİ */}
        <div className="p-4 sm:p-6 lg:p-8 grid gap-6 sm:gap-8 sm:grid-cols-2">
          {/* Müşteri Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-deep">
              Müşteri Bilgileri
            </h3>
            <div>
              <dt className="text-xs text-main/50">Ad Soyad</dt>
              <dd className="text-base sm:text-lg font-semibold text-main break-words">
                {apt?.customer?.person.name} {apt?.customer?.person.surname}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-main/50">Telefon</dt>
              <dd className="text-main break-words">
                {apt?.customer?.person.phone_number}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-main/50">E-posta</dt>
              <dd className="text-main break-words">{apt?.customer?.email}</dd>
            </div>
          </div>

          {/* Randevu Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-deep">
              Randevu Detayı
            </h3>
            <div>
              <dt className="text-xs text-main/50">Hizmet</dt>
              <dd className="text-base sm:text-lg font-semibold text-main break-words">
                {apt?.service.name}{" "}
                <span className="text-sm font-normal text-main/50">
                  ({apt?.service.duration} dk)
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-main/50">Tarih</dt>
              <dd className="text-main">
                {apt ? formatDate(apt.start_date) : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-main/50">Saat Aralığı</dt>
              <dd className="text-main font-medium">
                {apt
                  ? `${formatTime(apt.start_date)} - ${formatTime(apt.end_date)}`
                  : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-main/50">Mevcut Durum</dt>
              <dd className="mt-1">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    apt?.status.name === "pending"
                      ? "bg-waiting/10 text-waiting"
                      : apt?.status.name === "confirmed"
                        ? "bg-deep/10 text-deep"
                        : apt?.status.name === "completed"
                          ? "bg-completed/10 text-completed"
                          : "bg-canceld/10 text-canceld"
                  }`}
                >
                  {apt?.status.name.toUpperCase()}
                </span>
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

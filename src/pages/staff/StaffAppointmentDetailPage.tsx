import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import {
  useStaffGetAppointmentByIdQuery,
  useStaffUpdateStateMutation,
} from "../../hooks/useAppointmentQueries";

import Loading from "../components/Loading";
import Error from "../components/Error";
import StatusBadge from "../../components/StatusBadge";
import { formatTime, formatDate } from "../../utils/dates";

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
    <div className="page-wide">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-main/70 hover:text-main transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Listeye Dön
      </button>

      <div className="card-lg overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-main/10 bg-back/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-main text-balance">Randevu # {apt?.id}</h1>

          <form
            onSubmit={handleUpdateStatus}
            className="flex items-center gap-2"
          >
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
            >
              <option value="">Durum Seçin</option>
              <option value="2">Onaylandı</option>
              <option value="3">Tamamlandı</option>
            </select>
            <button
              type="submit"
              disabled={updateStatus.isPending || !selectedStatus}
              className="btn-primary"
            >
              {updateStatus.isPending ? "Kaydediliyor..." : "Güncelle"}
            </button>
          </form>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid gap-6 sm:gap-8 sm:grid-cols-2">
          <div className="section-gap-sm">
            <h3 className="section-header">Müşteri Bilgileri</h3>
            <div>
              <dt className="detail-label">Ad Soyad</dt>
              <dd className="text-base sm:text-lg font-semibold text-main break-words">
                {apt?.customer?.person.name} {apt?.customer?.person.surname}
              </dd>
            </div>
            <div>
              <dt className="detail-label">Telefon</dt>
              <dd className="text-main break-words">
                {apt?.customer?.person.phone_number}
              </dd>
            </div>
            <div>
              <dt className="detail-label">E-posta</dt>
              <dd className="text-main break-words">{apt?.customer?.email}</dd>
            </div>
          </div>

          <div className="section-gap-sm">
            <h3 className="section-header">Randevu Detayı</h3>
            <div>
              <dt className="detail-label">Hizmet</dt>
              <dd className="text-base sm:text-lg font-semibold text-main break-words">
                {apt?.service.name}{" "}
                <span className="text-sm font-normal text-main/50">
                  ({apt?.service.duration} dk)
                </span>
              </dd>
            </div>
            <div>
              <dt className="detail-label">Tarih</dt>
              <dd className="detail-value">
                {apt ? formatDate(apt.start_date) : ""}
              </dd>
            </div>
            <div>
              <dt className="detail-label">Saat Aralığı</dt>
              <dd className="text-main font-medium">
                {apt
                  ? `${formatTime(apt.start_date)} - ${formatTime(apt.end_date)}`
                  : ""}
              </dd>
            </div>
            <div>
              <dt className="detail-label">Mevcut Durum</dt>
              <dd className="mt-1">
                <StatusBadge status={apt?.status.name ?? ""} />
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

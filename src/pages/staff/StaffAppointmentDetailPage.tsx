import { useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Check, CheckCircle2, X } from "lucide-react";
import {
  useStaffGetAppointmentByIdQuery,
  useStaffUpdateStateMutation,
} from "../../hooks/useAppointmentQueries";

import Loading from "../components/Loading";
import Error from "../components/Error";
import StatusBadge from "../../components/StatusBadge";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../hooks/useToast";
import {
  APPOINTMENT_STATUS,
  STATUS_LABELS,
  STATUS_NAME_BY_ID,
} from "../../other/constants";
import type { AppointmentStatusId } from "../../other/constants";
import { formatTime, formatDate } from "../../utils/dates";

function statusLabel(id: number): string {
  return STATUS_LABELS[STATUS_NAME_BY_ID[id as AppointmentStatusId]] ?? "bilinmiyor";
}

export default function StaffAppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Guard: a non-numeric id (e.g. URL with garbage) used to call
  // Number(undefined) and send "NaN" in the API request. Bail out early
  // with a friendlier message instead.
  if (!id || !/^\d+$/.test(id)) {
    return (
      <div className="page-wide text-center text-canceld">
        <p className="text-xl font-bold">Geçersiz randevu.</p>
      </div>
    );
  }

  const {
    data: apt,
    isPending,
    isError,
    error,
  } = useStaffGetAppointmentByIdQuery(Number(id));
  const updateStatus = useStaffUpdateStateMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (newStateId: number) => {
    const ok = await confirm({
      title: "Durumu Güncelle",
      description: `Randevunun durumunu "${statusLabel(newStateId)}" olarak değiştirmek istediğinize emin misiniz?`,
      confirmLabel: "Evet, Güncelle",
      cancelLabel: "Vazgeç",
      variant: "primary",
    });
    if (!ok) return;
    try {
      await updateStatus.mutateAsync({ id: Number(id), data: { state_id: newStateId } });
      queryClient.invalidateQueries({ queryKey: ["appointments", "staff"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "staff", id] });
      toast.success("Durum güncellendi.");
    } catch {
      toast.error("Durum güncellenirken bir hata oluştu.");
    }
  };

  if (isPending) return <Loading message="Randevu detayı yükleniyor..." />;
  if (isError) return <Error message={error?.response?.data?.message} />;

  const currentStatus = apt?.state_id;
  const canConfirm = currentStatus === APPOINTMENT_STATUS.PENDING;
  const canComplete = currentStatus === APPOINTMENT_STATUS.CONFIRMED;
  const canCancel =
    currentStatus === APPOINTMENT_STATUS.PENDING ||
    currentStatus === APPOINTMENT_STATUS.CONFIRMED;

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

          <div className="flex flex-wrap items-center gap-2">
            {canConfirm && (
              <button
                onClick={() => handleStatusUpdate(APPOINTMENT_STATUS.CONFIRMED)}
                disabled={updateStatus.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-completed text-white hover:bg-completed/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="h-4 w-4" />
                Onayla
              </button>
            )}
            {canComplete && (
              <button
                onClick={() => handleStatusUpdate(APPOINTMENT_STATUS.COMPLETED)}
                disabled={updateStatus.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-deep text-white hover:bg-deep/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Tamamla
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => handleStatusUpdate(APPOINTMENT_STATUS.CANCELLED)}
                disabled={updateStatus.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-canceld/10 text-canceld border border-canceld/20 hover:bg-canceld/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="h-4 w-4" />
                İptal Et
              </button>
            )}
            {!canConfirm && !canComplete && !canCancel && (
              <span className="text-sm text-main/50 italic">
                Bu randevu için başka işlem yapılamaz.
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid gap-6 sm:gap-8 sm:grid-cols-2">
          <div className="section-gap-sm">
            <h3 className="section-header">Müşteri Bilgileri</h3>
            <dl>
              <dt className="detail-label">Ad Soyad</dt>
              <dd className="text-base sm:text-lg font-semibold text-main break-words">
                {apt?.customer?.person.name} {apt?.customer?.person.surname}
              </dd>
            </dl>
            <dl>
              <dt className="detail-label">Telefon</dt>
              <dd className="text-main break-words">
                {apt?.customer?.person.phone_number}
              </dd>
            </dl>
            <dl>
              <dt className="detail-label">E-posta</dt>
              <dd className="text-main break-words">{apt?.customer?.email}</dd>
            </dl>
          </div>

          <div className="section-gap-sm">
            <h3 className="section-header">Randevu Detayı</h3>
            <dl>
              <dt className="detail-label">Hizmet</dt>
              <dd className="text-base sm:text-lg font-semibold text-main break-words">
                {apt?.service.name}{" "}
                <span className="text-sm font-normal text-main/50">
                  ({apt?.service.duration} dk)
                </span>
              </dd>
            </dl>
            <dl>
              <dt className="detail-label">Tarih</dt>
              <dd className="detail-value">
                {apt ? formatDate(apt.start_date) : ""}
              </dd>
            </dl>
            <dl>
              <dt className="detail-label">Saat Aralığı</dt>
              <dd className="text-main font-medium">
                {apt
                  ? `${formatTime(apt.start_date)} - ${formatTime(apt.end_date)}`
                  : ""}
              </dd>
            </dl>
            <dl>
              <dt className="detail-label">Mevcut Durum</dt>
              <dd className="mt-1">
                <StatusBadge status={apt?.status.name ?? ""} />
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

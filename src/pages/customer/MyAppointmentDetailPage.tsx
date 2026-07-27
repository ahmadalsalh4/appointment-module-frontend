import { useParams, Link, useNavigate } from "react-router";
import { Calendar, Clock } from "lucide-react";
import {
  useCustomerGetAppointmentByIdQuery,
  useCancelAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../../components/StatusBadge";
import Breadcrumb from "../../components/Breadcrumb";
import QueryGate from "../../components/QueryGate";
import Avatar from "../../components/Avatar";
import { formatDateTime } from "../../utils/dates";

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

  if (isError || !appointment) {
    return (
      <div className="page-wide text-center text-canceld">
        <p className="text-xl font-bold">Randevu bulunamadı.</p>
        <Link
          to="/appointments"
          className="mt-4 inline-block text-deep hover:underline"
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
    <QueryGate isLoading={isLoading} isError={false} errorMessage="">
    <div className="page-wide">
      <Breadcrumb
        items={[
          { label: "Randevularım", to: "/appointments" },
          { label: `#${appointment.id}` },
        ]}
      />

      <div className="card-lg overflow-hidden">
        <div
          className={`p-4 sm:p-6 border-b ${
            appointment.status.name === "confirmed"
              ? "bg-completed/10 border-completed/20 text-completed"
              : appointment.status.name === "completed"
                ? "bg-deep/10 border-deep/20 text-deep"
                : appointment.status.name === "cancelled"
                  ? "bg-canceld/10 border-canceld/20 text-canceld"
                  : "bg-waiting/10 border-waiting/20 text-waiting"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                Durum
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold mt-1 text-balance">
                <StatusBadge status={appointment.status.name} />
              </h1>
            </div>
            {isCancellable && (
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="self-start sm:self-center btn-destructive"
              >
                {cancelMutation.isPending
                  ? "İptal Ediliyor..."
                  : "Randevuyu İptal Et"}
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="section-gap-sm">
            <h2 className="section-header">Randevu Detayları</h2>

            <div className="flex items-start gap-4">
              <span className="icon-box shrink-0">
                <Calendar className="h-6 w-6" />
              </span>
              <div>
                <p className="detail-label">Tarih ve Saat</p>
                <p className="detail-value">
                  {formatDateTime(appointment.start_date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="icon-box shrink-0">
                <Clock className="h-6 w-6" />
              </span>
              <div>
                <p className="detail-label">Hizmet ve Süre</p>
                <p className="detail-value">
                  {appointment.service.name}{" "}
                  <span className="text-main/40 font-normal">
                    ({appointment.service.duration} dk)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {appointment.staff && (
            <div className="section-gap-sm">
              <h2 className="section-header">Personel Bilgileri</h2>
              <div className="flex items-center gap-4 bg-back p-4 rounded-xl">
                <Avatar
                  name={appointment.staff.person.name}
                  surname={appointment.staff.person.surname}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="text-base sm:text-lg text-main font-bold truncate">
                    {appointment.staff.person.name}{" "}
                    {appointment.staff.person.surname}
                  </p>
                  <p className="text-sm text-main/60">
                    {appointment.staff.job_title}
                  </p>
                  <p className="text-sm text-main/40">
                    {appointment.staff.person.phone_number}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </QueryGate>
  );
}

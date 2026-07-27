import { useParams, Link, useNavigate } from "react-router";
import {
  useCustomerGetAppointmentByIdQuery,
  useCancelAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../../components/StatusBadge";
import Breadcrumb from "../../components/Breadcrumb";
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

  if (isLoading) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }

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
  );
}

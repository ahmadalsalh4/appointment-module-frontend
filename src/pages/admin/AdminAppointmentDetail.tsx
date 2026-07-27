import React from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Calendar, Clock } from "lucide-react";
import {
  useAdminGetAppointmentByIdQuery,
  useAdminUpdateAppointmentMutation,
  useAdminDeleteAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../../components/StatusBadge";
import Breadcrumb from "../../components/Breadcrumb";
import QueryGate from "../../components/QueryGate";
import Avatar from "../../components/Avatar";
import { formatDate, formatTime } from "../../utils/dates";

export default function AdminAppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: appointment,
    isLoading,
    isError,
  } = useAdminGetAppointmentByIdQuery(id || "");
  const updateAppointmentMut = useAdminUpdateAppointmentMutation();
  const deleteMut = useAdminDeleteAppointmentMutation();

  const handleStatusUpdate = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStateId = Number(e.target.value);
    try {
      await updateAppointmentMut.mutateAsync({
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

  if (isError || !appointment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-canceld">
        <p className="text-xl font-bold">Randevu bulunamadı.</p>
        <Link
          to="/admin/appointments"
          className="mt-4 inline-block text-deep hover:underline"
        >
          Randevulara Dön
        </Link>
      </div>
    );
  }

  return (
    <QueryGate isLoading={isLoading} isError={false} errorMessage="">
      <Breadcrumb
        items={[
          { label: "Randevular", to: "/admin/appointments" },
          { label: `#${appointment.id}` },
        ]}
      />

      <div className="card-lg overflow-hidden">
        {/* Header Status Bar */}
        <div className={`p-4 sm:p-6 border-b badge-${appointment.status.name}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                Mevcut Durum
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold mt-1 text-balance">
                <StatusBadge
                  status={appointment.status.name}
                  className="text-lg px-4 py-1.5"
                />
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
                disabled={updateAppointmentMut.isPending}
                className="bg-surface text-main font-bold rounded-lg shadow-sm border border-main/20 px-4 py-2.5 focus:ring-2 focus:ring-deep/20 focus:border-deep outline-none disabled:bg-main/15 disabled:text-main/40"
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
              <h2 className="section-header">Randevu Detayları</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 bg-back p-4 rounded-xl">
                  <div className="icon-box">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="detail-label">Tarih ve Saat</p>
                    <p className="detail-value">
                      {formatDate(appointment.start_date)}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-deep">
                      {formatTime(appointment.start_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-back p-4 rounded-xl">
                  <div className="icon-box">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="detail-label">Hizmet ve Süre</p>
                    <p className="detail-value">{appointment.service.name}</p>
                    <p className="text-sm text-main/60">
                      {appointment.service.duration} Dakika
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            {appointment.customer && (
              <div>
                <h2 className="section-header">Müşteri Bilgileri</h2>
                <div className="flex items-center gap-4 bg-back p-4 rounded-xl">
                  <Avatar
                    name={appointment.customer.person.name}
                    surname={appointment.customer.person.surname}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="text-base sm:text-lg text-main font-bold truncate">
                      {appointment.customer.person.name}{" "}
                      {appointment.customer.person.surname}
                    </p>
                    <p className="text-sm text-main/60 wrap-break-word">
                      {appointment.customer.email}
                    </p>
                    <p className="text-sm text-main/40 wrap-break-word">
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
                    <p className="text-sm text-main/40 wrap-break-word">
                      {appointment.staff.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="mt-auto">
              <h2 className="text-lg font-bold text-canceld border-b border-canceld/20 pb-2 mb-4">
                Tehlikeli Alan
              </h2>
              <div className="bg-canceld/10 border border-canceld/20 rounded-xl p-4">
                <p className="text-sm text-canceld mb-4">
                  Bu randevuyu silmek geri alınamaz. Müşteri ve personel
                  bilgilendirilmeyecektir.
                </p>
                <button
                  onClick={handleDelete}
                  disabled={deleteMut.isPending}
                  className="btn-destructive w-full"
                >
                  {deleteMut.isPending ? (
                    <>
                      <span className="spinner-sm" />
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
    </QueryGate>
  );
}

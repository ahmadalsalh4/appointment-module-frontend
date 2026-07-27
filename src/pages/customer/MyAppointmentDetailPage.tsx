import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Calendar, Clock, Edit3 } from "lucide-react";
import {
  useCustomerGetAppointmentByIdQuery,
  useCancelAppointmentMutation,
  useUpdateMyAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useGetServiceStaffQuery } from "../../hooks/useServiceQueries";
import { useGetCategoryStaffQuery } from "../../hooks/useCategoryQueries";
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

  const { data: appointment, isLoading, isError } = useCustomerGetAppointmentByIdQuery(id || "");
  const cancelMutation = useCancelAppointmentMutation();
  const updateMutation = useUpdateMyAppointmentMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editStaff, setEditStaff] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const { data: serviceStaff } = useGetServiceStaffQuery(String(appointment?.service_id ?? ""));
  const { data: categoryStaff } = useGetCategoryStaffQuery(String(appointment?.service?.category?.id ?? ""));

  const handleCancel = async () => {
    if (!window.confirm("Randevunuzu iptal etmek istediğinize emin misiniz?")) return;
    try {
      await cancelMutation.mutateAsync(id!);
      queryClient.invalidateQueries({ queryKey: ["appointments", "customer"] });
      navigate("/appointments");
    } catch {
      alert("Randevu iptal edilirken bir hata oluştu.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: Record<string, unknown> = {};
    if (editStaff) body.staff_id = Number(editStaff);
    if (editDate && editTime) {
      body.start_date = `${editDate}T${editTime}:00.000000Z`;
    } else if (editDate) {
      const oldTime = appointment?.start_date?.split("T")[1]?.slice(0, 5) ?? "09:00";
      body.start_date = `${editDate}T${oldTime}:00.000000Z`;
    }

    try {
      await updateMutation.mutateAsync({ id: id!, data: body as any });
      queryClient.invalidateQueries({ queryKey: ["appointments", "customer"] });
      setIsEditing(false);
    } catch {
      alert("Randevu güncellenirken bir hata oluştu.");
    }
  };

  if (isError || !appointment) {
    return (
      <div className="page-wide text-center text-canceld">
        <p className="text-xl font-bold">Randevu bulunamadı.</p>
        <Link to="/appointments" className="mt-4 inline-block text-deep hover:underline">Randevularıma Dön</Link>
      </div>
    );
  }

  const isCancellable = appointment.status.name === "pending" || appointment.status.name === "confirmed";
  const isEditable = appointment.status.name === "pending";

  return (
    <QueryGate isLoading={isLoading} isError={false} errorMessage="">
    <div className="page-wide">
      <Breadcrumb items={[{ label: "Randevularım", to: "/appointments" }, { label: `#${appointment.id}` }]} />

      <div className="card-lg overflow-hidden">
        <div className={`p-4 sm:p-6 border-b ${
          appointment.status.name === "confirmed" ? "bg-completed/10 border-completed/20 text-completed" :
          appointment.status.name === "completed" ? "bg-deep/10 border-deep/20 text-deep" :
          appointment.status.name === "cancelled" ? "bg-canceld/10 border-canceld/20 text-canceld" :
          "bg-waiting/10 border-waiting/20 text-waiting"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">Durum</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold mt-1 text-balance"><StatusBadge status={appointment.status.name} /></h1>
            </div>
            <div className="flex gap-2">
              {isEditable && (
                <button onClick={() => { setIsEditing(!isEditing); setEditStaff(String(appointment.staff_id || "")); setEditDate(appointment.start_date?.slice(0, 10) || ""); }} className="btn-primary flex items-center gap-1.5">
                  <Edit3 className="h-4 w-4" /> Düzenle
                </button>
              )}
              {isCancellable && (
                <button onClick={handleCancel} disabled={cancelMutation.isPending} className="btn-destructive">
                  {cancelMutation.isPending ? "İptal Ediliyor..." : "Randevuyu İptal Et"}
                </button>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="p-4 sm:p-6 border-b border-main/10 bg-back">
            <h3 className="font-bold text-main mb-4">Randevuyu Düzenle</h3>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label-sm">Personel</label>
                <select value={editStaff} onChange={(e) => setEditStaff(e.target.value)} className="input text-sm">
                  <option value="">Değiştirme</option>
                  {serviceStaff?.data?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.person.name} {s.person.surname}</option>
                  ))}
                  {categoryStaff?.data?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.person.name} {s.person.surname}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-sm">Tarih</label>
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="input text-sm" min={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="label-sm">Saat (opsiyonel)</label>
                  <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="input text-sm" step="900" />
                </div>
                <button type="submit" disabled={updateMutation.isPending} className="btn-primary text-sm h-[38px]">
                  {updateMutation.isPending ? "..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="section-gap-sm">
            <h2 className="section-header">Randevu Detayları</h2>
            <div className="flex items-start gap-4">
              <span className="icon-box shrink-0"><Calendar className="h-6 w-6" /></span>
              <div>
                <p className="detail-label">Tarih ve Saat</p>
                <p className="detail-value">{formatDateTime(appointment.start_date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="icon-box shrink-0"><Clock className="h-6 w-6" /></span>
              <div>
                <p className="detail-label">Hizmet ve Süre</p>
                <p className="detail-value">{appointment.service.name} <span className="text-main/40 font-normal">({appointment.service.duration} dk)</span></p>
              </div>
            </div>
          </div>

          {appointment.staff && (
            <div className="section-gap-sm">
              <h2 className="section-header">Personel Bilgileri</h2>
              <div className="flex items-center gap-4 bg-back p-4 rounded-xl">
                <Avatar name={appointment.staff.person.name} surname={appointment.staff.person.surname} size="md" />
                <div className="min-w-0">
                  <p className="text-base sm:text-lg text-main font-bold truncate">{appointment.staff.person.name} {appointment.staff.person.surname}</p>
                  <p className="text-sm text-main/60">{appointment.staff.job_title}</p>
                  <p className="text-sm text-main/40">{appointment.staff.person.phone_number}</p>
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

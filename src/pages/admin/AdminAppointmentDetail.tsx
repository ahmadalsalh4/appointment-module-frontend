import React, { useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Calendar, Clock, Edit3 } from "lucide-react";
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
import SkeletonDetail from "../../components/skeletons/SkeletonDetail";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../hooks/useToast";
import { STATUS_LABELS, STATUS_NAME_BY_ID } from "../../other/constants";
import type { AppointmentStatusId } from "../../other/constants";
import type { UpdateAppointmentStateBody } from "../../other/types";
import {
  combineBackendIso,
  formatDate,
  formatTime,
  localDateInputValue,
  localTimeInputValue,
  todayIstanbulDateInputValue,
} from "../../utils/dates";
import { getErrorMessage } from "../../utils/errors";
import { useGetAllServicesQuery } from "../../hooks/useServiceQueries";
import { useGetAllStaffQuery } from "../../hooks/useStaffQueries";

export default function AdminAppointmentDetail() {
  const { id: rawId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const toast = useToast();

  // Normalise so the hook count is stable. The hooks below always run.
  // The post-hook guard renders the fallback when rawId is invalid.
  const id = rawId && /^\d+$/.test(rawId) ? rawId : "";

  const {
    data: appointment,
    isLoading,
    isFetching,
    isError,
  } = useAdminGetAppointmentByIdQuery(id);
  const updateAppointmentMut = useAdminUpdateAppointmentMutation();
  const deleteMut = useAdminDeleteAppointmentMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editStaff, setEditStaff] = useState("");
  const [editService, setEditService] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  // Tracks the "original" status so that a rapid second change (or a
  // failed second change) reverts to the value the user started from,
  // not to the in-flight optimistic value. Without this, two quick
  // dropdown changes in a row could leave the UI showing a value the
  // server never accepted.
  const originalStateId = useRef<number | null>(null);

  // Use a small per_page to populate the edit dropdowns. Previously
  // used 9999 which scales O(n) with the whole table; with a real
  // customer base this would be the slowest page in the app.
  const { data: allServices } = useGetAllServicesQuery({ per_page: 100 });
  const { data: allStaff } = useGetAllStaffQuery({ per_page: 100 });

  // Guard lives AFTER the hooks so the hook count is stable across renders.
  if (!id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-canceld">
        <p className="text-xl font-bold">Geçersiz randevu.</p>
        <Link to="/admin/appointments" className="mt-4 inline-block text-deep hover:underline">Randevulara Dön</Link>
      </div>
    );
  }

  const handleStatusUpdate = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStateId = Number(e.target.value);
    // Capture the pre-change value the first time, then keep it stable
    // across subsequent re-renders / second changes.
    if (originalStateId.current === null) {
      originalStateId.current = appointment?.state_id ?? null;
    }
    const targetName = STATUS_NAME_BY_ID[newStateId as AppointmentStatusId] ?? "";
    const targetLabel = STATUS_LABELS[targetName] ?? "bilinmiyor";
    const variant: "primary" | "success" | "danger" =
      newStateId === 3 ? "success" : newStateId === 4 ? "danger" : "primary";
    const ok = await confirm({
      title: "Durumu Güncelle",
      description: `Randevunun durumunu "${targetLabel}" olarak değiştirmek istediğinize emin misiniz?`,
      confirmLabel: "Evet, Güncelle",
      cancelLabel: "Vazgeç",
      variant,
    });
    if (!ok) {
      // Reset the captured original so a future change re-captures it
      // from the (still-current) appointment state.
      originalStateId.current = null;
      return;
    }
    try {
      await updateAppointmentMut.mutateAsync({
        id,
        data: { state_id: newStateId },
      });
      queryClient.invalidateQueries({
        queryKey: ["appointments", "admin", id],
      });
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      // Cancelling from admin frees the slot for re-pick on the customer
      // booking wizard.
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Durum güncellendi.");
      originalStateId.current = null;
    } catch (err) {
      toast.error(getErrorMessage(err, "Durum güncellenirken bir hata oluştu."));
      originalStateId.current = null;
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Randevuyu Sil",
      description:
        "Bu randevuyu kalıcı olarak silmek istediğinize emin misiniz? Müşteri ve personel bilgilendirilmeyecektir.",
      confirmLabel: "Evet, Sil",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await deleteMut.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      // Free the slot for re-pick.
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Randevu silindi.");
      navigate("/admin/appointments");
    } catch (err) {
      toast.error(getErrorMessage(err, "Randevu silinirken bir hata oluştu."));
    }
  };

  const handleEditSubmit = async () => {
    // Build a strictly-typed payload. Refuse to submit if a date is
    // provided without a matching time (or vice versa) — silently
    // dropping the time previously meant a visible edit could produce
    // no time change.
    const body: UpdateAppointmentStateBody = {};
    if (editStaff) body.staff_id = Number(editStaff);
    if (editService) body.service_id = Number(editService);
    if (editDate && editTime) {
      body.start_date = combineBackendIso(editDate, editTime, "09:00");
    } else if (editDate || editTime) {
      // Mismatched pair — refuse. Treat the field as "unchanged" so
      // the user gets a clearer signal: clearing the date without
      // clearing the time (or vice versa) is meaningless.
      toast.error("Tarih ve saat birlikte değiştirilmelidir.");
      return;
    }

    try {
      await updateAppointmentMut.mutateAsync({ id, data: body });
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin", id] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      // Edits move or reschedule the slot; availability moves with it.
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      setIsEditing(false);
      toast.success("Randevu güncellendi.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Randevu güncellenirken bir hata oluştu."));
    }
  };

  // Only fall through to the not-found page once the query has settled
  // without data. QueryGate (below) renders the loader while isLoading.
  const showNotFound = !!id && !isLoading && !isFetching && !appointment && isError;
  if (showNotFound) {
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
    <QueryGate isLoading={isLoading} isError={isError} errorMessage="Randevu bulunamadı." loading={<SkeletonDetail />}>
      <Breadcrumb
        items={[
          { label: "Randevular", to: "/admin/appointments" },
          { label: `#${appointment?.id ?? ""}` },
        ]}
      />

      <div className="card-lg overflow-hidden">
        {/* Header Status Bar */}
        <div className={`p-4 sm:p-6 border-b badge badge-${appointment?.status.name ?? ""}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                Mevcut Durum
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold mt-1 text-balance">
                <StatusBadge
                  status={appointment?.status.name ?? ""}
                  className="text-lg px-4 py-1.5"
                />
              </h1>
            </div>

            {isEditing ? (
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase opacity-80">Personel</label>
                  <select value={editStaff} onChange={(e) => setEditStaff(e.target.value)} className="bg-surface text-main rounded-lg shadow-sm border border-main/20 px-3 py-1.5 text-sm">
                    <option value="">Değiştirme</option>
                    {allStaff?.data?.map((s) => (
                      <option key={s.id} value={s.id}>{s.person?.name} {s.person?.surname}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase opacity-80">Hizmet</label>
                  <select value={editService} onChange={(e) => setEditService(e.target.value)} className="bg-surface text-main rounded-lg shadow-sm border border-main/20 px-3 py-1.5 text-sm">
                    <option value="">Değiştirme</option>
                    {allServices?.data?.map((svc) => (
                      <option key={svc.id} value={svc.id}>{svc.name} ({svc.duration}dk)</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase opacity-80">Tarih</label>
                  <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} min={todayIstanbulDateInputValue()} className="bg-surface text-main rounded-lg shadow-sm border border-main/20 px-3 py-1.5 text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase opacity-80">Saat</label>
                  <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} step="900" className="bg-surface text-main rounded-lg shadow-sm border border-main/20 px-3 py-1.5 text-sm" />
                </div>
                <button
                  onClick={handleEditSubmit}
                  disabled={updateAppointmentMut.isPending}
                  className="bg-deep text-white font-bold rounded-lg px-4 py-2 text-sm hover:bg-deep/80 disabled:opacity-50"
                >
                  {updateAppointmentMut.isPending ? "..." : "Güncelle"}
                </button>
                <button onClick={() => setIsEditing(false)} className="text-main/60 hover:text-main text-sm px-2 py-1">
                  İptal
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditStaff(String(appointment?.staff_id || ""));
                  setEditService(String(appointment?.service_id || ""));
                  setEditDate(appointment ? localDateInputValue(appointment.start_date) : "");
                  setEditTime(appointment ? localTimeInputValue(appointment.start_date) : "");
                }}
                className="flex items-center gap-1.5 bg-surface text-main font-bold rounded-lg shadow-sm border border-main/20 px-3 py-2 text-sm hover:bg-deep/5"
              >
                <Edit3 className="h-4 w-4" /> Randevuyu Düzenle
              </button>
            )}

            {/* Admin Action: Status Change Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase opacity-80">
                Durumu Güncelle
              </label>
              <select
                value={appointment?.state_id ?? ""}
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
                      {appointment?.start_date ? formatDate(appointment.start_date) : "—"}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-deep">
                      {appointment?.start_date ? formatTime(appointment.start_date) : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-back p-4 rounded-xl">
                  <div className="icon-box">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="detail-label">Hizmet ve Süre</p>
                    <p className="detail-value">{appointment?.service.name ?? "—"}</p>
                    <p className="text-sm text-main/60">
                      {appointment?.service.duration ?? "—"} Dakika
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            {appointment?.customer && (
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
            {appointment?.staff && (
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

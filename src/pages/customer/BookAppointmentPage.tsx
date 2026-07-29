import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, User, UserCheck, Users } from "lucide-react";
import {
  useGetServiceByIdQuery,
  useGetServiceStaffQuery,
} from "../../hooks/useServiceQueries";
import {
  useGetAvailabilityMutation,
  useCreateAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useAuth } from "../../contexts/auth/useAuth";
import Stepper, { type StepperStep } from "../../components/Stepper";
import { useStepper } from "../../hooks/useStepper";
import { useToast } from "../../hooks/useToast";
import Breadcrumb from "../../components/Breadcrumb";
import QueryGate from "../../components/QueryGate";
import Avatar from "../../components/Avatar";
import { formatDate, toLocalIsoString, todayLocalDateInputValue } from "../../utils/dates";
import type { CustomerProfile, PublicStaff } from "../../other/types";
import type { GetAvailabilityBody } from "../../other/types";

const STEPS: StepperStep[] = [
  { id: "service", label: "Hizmet" },
  { id: "staff", label: "Personel" },
  { id: "date", label: "Tarih" },
  { id: "time", label: "Saat" },
  { id: "summary", label: "Onay" },
];

export default function BookAppointmentPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  const customerProfile = user && "person" in user ? (user as CustomerProfile) : null;

  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);

  const { data: service, isLoading, isError } = useGetServiceByIdQuery(serviceId || "");
  // Service-scoped staff is authoritative. The category fallback was
  // removed when catagory_id → category_id was renamed.
  const { data: serviceStaff } = useGetServiceStaffQuery(serviceId || "");

  const availability = useGetAvailabilityMutation();
  const createAppointment = useCreateAppointmentMutation();

  const staffList: PublicStaff[] = serviceStaff ?? [];

  const selectedStaff = staffList.find((s) => String(s.id) === selectedStaffId);

  const stepsWithGates: StepperStep[] = STEPS.map((step) => {
    if (step.id === "staff") {
      return { ...step, canAdvance: () => !!selectedStaffId };
    }
    if (step.id === "date") {
      return { ...step, canAdvance: () => !!selectedDate };
    }
    if (step.id === "time") {
      return { ...step, canAdvance: () => !!selectedTime };
    }
    return step;
  });

  const { currentStep, next, prev, goTo, canAdvance, isFirst, isLast } = useStepper(
    stepsWithGates,
    0,
  );

  const handleCheckAvailability = async () => {
    if (!selectedDate || !selectedStaffId || !serviceId) return;
    setSlots([]);
    setSelectedTime(null);
    try {
      const body: GetAvailabilityBody = {
        staff_id: selectedStaffId,
        service_id: serviceId,
        date: selectedDate,
      };
      const res = await availability.mutateAsync(body);
      setSlots(res.available_slots);
    } catch {
      toast.error("Müsaitlik kontrolü başarısız oldu.");
      setSlots([]);
    }
  };

  const handleConfirm = async () => {
    if (!selectedTime || !selectedStaffId || !selectedDate || !serviceId) return;
    const start_date = toLocalIsoString(selectedDate, selectedTime);
    try {
      await createAppointment.mutateAsync({
        staff_id: Number(selectedStaffId),
        service_id: Number(serviceId),
        start_date,
      });
      queryClient.invalidateQueries({ queryKey: ["appointments", "customer"] });
      toast.success("Randevunuz başarıyla oluşturuldu.");
      navigate("/appointments");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || "Randevu oluşturulurken bir hata oluştu.");
    }
  };

  if (isError || (!isLoading && !service)) {
    return (
      <div className="page-xl text-center text-canceld">
        <p className="text-xl font-bold">Hizmet bulunamadı.</p>
        <Link to="/services" className="mt-4 inline-block text-deep hover:underline">
          Hizmetlere Dön
        </Link>
      </div>
    );
  }

  const today = todayLocalDateInputValue();

  return (
    <QueryGate isLoading={isLoading} isError={false} errorMessage="">
      <div className="page-xl">
        <Breadcrumb
          items={[
            { label: "Hizmetler", to: "/services" },
            { label: service?.name ?? "Hizmet" },
            { label: "Randevu Oluştur" },
          ]}
        />

        <div className="mb-8">
          <h1 className="page-header">Yeni Randevu</h1>
          <p className="text-main/60 text-sm mt-1">
            Randevunuzu oluşturmak için aşağıdaki adımları takip edin.
          </p>
        </div>

        <div className="card p-4 sm:p-6 mb-6">
          <Stepper steps={stepsWithGates} currentStep={currentStep} onStepChange={goTo} />
        </div>

        <div className="card-lg p-4 sm:p-6 lg:p-8 min-h-[400px]">
          {currentStep === 0 && service && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-start gap-4">
                <div className="icon-box">
                  <Calendar className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-main">{service.name}</h2>
                  {service.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-deep/10 text-deep uppercase tracking-wide mt-2">
                      {service.category.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-back p-4 rounded-xl">
                  <p className="text-xs text-main/60 uppercase font-semibold">Süre</p>
                  <p className="text-lg font-bold text-main mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-deep" /> {service.duration} dakika
                  </p>
                </div>
                <div className="bg-back p-4 rounded-xl">
                  <p className="text-xs text-main/60 uppercase font-semibold">Kategori</p>
                  <p className="text-lg font-bold text-main mt-1">
                    {service.category?.name ?? "—"}
                  </p>
                </div>
              </div>
              <p className="text-main/70">
                Bu hizmeti seçtiniz. Devam etmek için bir sonraki adımda size uygun personeli seçin.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-deep" />
                <h2 className="text-xl font-bold text-main">Personel Seçin</h2>
              </div>
              {staffList.length === 0 ? (
                <div className="text-center py-12 bg-back rounded-xl text-main/60">
                  Bu hizmet için uygun personel bulunamadı.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {staffList.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStaffId(String(s.id));
                        setSlots([]);
                        setSelectedTime(null);
                      }}
                      className={`text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                        selectedStaffId === String(s.id)
                          ? "border-deep bg-deep/5 shadow-sm"
                          : "border-main/10 hover:border-deep/30 hover:bg-back"
                      }`}
                    >
                      <Avatar name={s.person.name} surname={s.person.surname} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-main truncate">
                          {s.person.name} {s.person.surname}
                        </p>
                        <p className="text-sm text-main/60 truncate">{s.job_title}</p>
                      </div>
                      {selectedStaffId === String(s.id) && (
                        <Check className="h-5 w-5 text-deep shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-6 w-6 text-deep" />
                <h2 className="text-xl font-bold text-main">Tarih Seçin</h2>
              </div>
              <div>
                <label className="label">Randevu Tarihi</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSlots([]);
                    setSelectedTime(null);
                  }}
                  min={today}
                  className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
                />
              </div>
              <p className="text-sm text-main/60">
                Personel çalışma günlerinde müsait saatler listelenecektir. Tatil günlerinde otomatik olarak uygun saat gösterilmez.
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-deep" />
                  <h2 className="text-xl font-bold text-main">Saat Seçin</h2>
                </div>
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={!selectedDate || availability.isPending}
                  className="btn-secondary text-sm"
                >
                  {availability.isPending ? (
                    <span className="spinner-sm" />
                  ) : (
                    "Müsait Saatleri Göster"
                  )}
                </button>
              </div>

              {!selectedDate && (
                <div className="text-center py-12 bg-back rounded-xl text-main/60">
                  Önce bir tarih seçmelisiniz.
                </div>
              )}

              {selectedDate && slots.length === 0 && !availability.isPending && (
                <div className="text-center py-12 bg-back rounded-xl text-main/60">
                  {availability.data
                    ? "Bu tarih için müsait saat bulunamadı. Lütfen başka bir tarih deneyin."
                    : "Müsait saatleri görmek için yukarıdaki butona tıklayın."}
                </div>
              )}

              {slots.length > 0 && (
                <div>
                  <p className="text-sm text-main/60 mb-3">
                    {selectedDate} için müsait saatler:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                    {slots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 px-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                          selectedTime === time
                            ? "bg-deep text-white border-deep shadow-md scale-105"
                            : "bg-surface text-main/80 border-main/10 hover:border-deep/30 hover:bg-deep/5"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && service && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-deep" />
                <h2 className="text-xl font-bold text-main">Randevu Özeti</h2>
              </div>
              <p className="text-sm text-main/60">
                Aşağıdaki bilgileri kontrol edin ve onaylayın. Onayladıktan sonra personelimiz randevunuzu değerlendirecektir.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SummaryItem label="Hizmet" value={service.name} />
                <SummaryItem label="Süre" value={`${service.duration} dakika`} />
                <SummaryItem
                  label="Personel"
                  value={
                    selectedStaff
                      ? `${selectedStaff.person.name} ${selectedStaff.person.surname}`
                      : "—"
                  }
                />
                <SummaryItem label="Kategori" value={service.category?.name ?? "—"} />
                <SummaryItem label="Tarih" value={selectedDate ? formatDate(selectedDate) : "—"} />
                <SummaryItem label="Saat" value={selectedTime ?? "—"} />
              </div>

              <div className="border-t border-main/10 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-deep" />
                  <h3 className="text-sm font-bold text-main uppercase tracking-wider">
                    İletişim Bilgileriniz
                  </h3>
                </div>
                {customerProfile ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SummaryItem
                      label="Ad Soyad"
                      value={`${customerProfile.person.name} ${customerProfile.person.surname}`}
                    />
                    <SummaryItem label="E-posta" value={customerProfile.email} />
                    <SummaryItem
                      label="Telefon"
                      value={customerProfile.person.phone_number}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-canceld">İletişim bilgileri yüklenemedi.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={isFirst}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              className="btn-primary"
            >
              İleri
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={
                !selectedTime ||
                !selectedStaffId ||
                !selectedDate ||
                !customerProfile ||
                createAppointment.isPending
              }
              className="btn-primary"
            >
              {createAppointment.isPending ? (
                <>
                  <span className="spinner-sm" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Randevuyu Onayla
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </QueryGate>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-back p-4 rounded-xl">
      <p className="text-xs text-main/60 uppercase font-semibold">{label}</p>
      <p className="text-base font-semibold text-main mt-1 break-words">{value}</p>
    </div>
  );
}

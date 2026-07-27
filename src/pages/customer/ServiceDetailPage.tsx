import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { ArrowLeft, Clock, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetServiceByIdQuery } from "../../hooks/useServiceQueries";
import {
  useGetAvailabilityMutation,
  useCreateAppointmentMutation,
} from "../../hooks/useAppointmentQueries";
import { useGetServiceStaffQuery } from "../../hooks/useServiceQueries";
import { useGetCategoryStaffQuery } from "../../hooks/useCategoryQueries";

import type { GetAvailabilityBody } from "../../other/types";
import { useAuth } from "../../contexts/auth/useAuth";
import Breadcrumb from "../../components/Breadcrumb";
import QueryGate from "../../components/QueryGate";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 1. Hizmet Detayları
  const {
    data: service,
    isLoading,
    isError,
  } = useGetServiceByIdQuery(id || "");

  // 2. SADECE HOOK'LARI BURAYA OLMALI! (Hook'lar return dışında olmalı)
  const { data: serviceStaff } = useGetServiceStaffQuery(id || "");
  const { data: categoryStaff } = useGetCategoryStaffQuery(
    service?.category?.id || "",
  );

  // 3. Mutations
  const checkAvailability = useGetAvailabilityMutation();
  const createAppointment = useCreateAppointmentMutation();

  const handleCheckAvailability = async () => {
    if (!selectedDate || !selectedStaff) return;
    setSlots([]);

    const body: GetAvailabilityBody = {
      staff_id: selectedStaff,
      service_id: id || "",
      date: selectedDate,
    };

    try {
      const res = await checkAvailability.mutateAsync(body);
      setSlots(res.available_slots);
      setSelectedTime(null);
    } catch {
      setSlots([]);
    }
  };

  const handleFinalBooking = async () => {
    if (!selectedTime || !selectedStaff || !selectedDate || !id) return;

    const start_date = `${selectedDate}T${selectedTime}:00.000000Z`;

    try {
      await createAppointment.mutateAsync({
        staff_id: Number(selectedStaff),
        service_id: Number(id),
        start_date,
      });

      queryClient.invalidateQueries({ queryKey: ["appointments", "customer"] });
      navigate("/appointments");
    } catch {
      alert("Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  if (isError || !service) {
    return (
      <div className="page-xl text-center text-canceld">
        <p className="text-xl font-bold">Hizmet bulunamadı.</p>
        <Link
          to="/services"
          className="mt-4 inline-block text-deep hover:underline"
        >
          Hizmetlere Dön
        </Link>
      </div>
    );
  }

  return (
    <QueryGate isLoading={isLoading} isError={false} errorMessage="">
    <div className="page-xl">
      <Breadcrumb
        items={[
          { label: "Hizmetler", to: "/services" },
          { label: service.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: Service Details */}
        <div className="lg:col-span-1">
          <div className="card-lg p-4 sm:p-6 lg:p-8 lg:sticky lg:top-8">
            {service.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-deep/10 text-deep uppercase tracking-wide mb-6">
                {service.category.name}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-extrabold text-main mb-4 text-balance">
              {service.name}
            </h1>

            <div className="flex items-center text-main/80 bg-back rounded-lg p-4 mb-6">
              <Clock className="h-6 w-6 mr-3 text-deep" />
              <div>
                <p className="text-xs text-main/60 uppercase font-semibold">
                  Süre
                </p>
                <p className="text-lg font-bold">{service.duration} Dakika</p>
              </div>
            </div>

            <p className="text-main/70 leading-relaxed mb-6">
              Bu hizmeti almak için sağdaki formdan uygun bir personel, tarih ve
              saat seçebilirsiniz.
            </p>

            <Link
              to="/services"
              className="inline-flex items-center text-sm font-semibold text-deep hover:text-deep/80"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Tüm Hizmetlere Dön
            </Link>
          </div>
        </div>

        {/* RIGHT: Booking Area */}
        <div className="lg:col-span-2">
          <div className="card-lg p-4 sm:p-6 lg:p-8">
            {/* --- GATE: Check if user is logged in --- */}
            {!token ? (
              <div className="text-center py-16 bg-back rounded-xl border border-main/10">
                <User className="mx-auto h-16 w-16 text-main/15 mb-4" strokeWidth={1} />
                <h3 className="text-xl font-bold text-main mb-2">
                  Randevu Oluşturmak İçin Giriş Yapın
                </h3>
                <p className="text-main/60 mb-6">
                  Hizmet detaylarını görüntüleyebilirsiniz, ancak randevu almak
                  için üye girişi yapmalısınız.
                </p>
                <Link to="/login" className="btn-primary">
                  Giriş Yap
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-main mb-6">
                  Randevu Oluştur
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Staff Select */}
                  <div>
                    <label className="label">
                      Personel Seçin
                    </label>
                    <select
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
                    >
                      <option value="">Seçiniz...</option>

                      {/* Öncelikle hizmete direkt atanmış personeller */}
                      {serviceStaff && serviceStaff.length > 0 && (
                        <optgroup label="Hizmete Atananlar">
                          {serviceStaff.map((s) => (
                            <option key={s.id} value={String(s.id)}>
                              {s.person.name} {s.person.surname}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Eğer hizmete atanmış yoksa, kategorideki tüm personelleri listeler */}
                      {(!serviceStaff || serviceStaff.length === 0) &&
                        categoryStaff &&
                        categoryStaff.length > 0 && (
                          <optgroup
                            label={`${service?.category?.name || "Kategori"} Personeli`}
                          >
                            {categoryStaff.map((s) => (
                              <option key={s.id} value={String(s.id)}>
                                {s.person.name} {s.person.surname}
                              </option>
                            ))}
                          </optgroup>
                        )}
                    </select>
                  </div>

                  {/* Date Select */}
                  <div>
                    <label className="label">
                      Tarih Seçin
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="input focus:border-deep focus:ring-2 focus:ring-deep/20"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCheckAvailability}
                  disabled={
                    !selectedDate ||
                    !selectedStaff ||
                    checkAvailability.isPending
                  }
                  className="btn-primary"
                >
                  {checkAvailability.isPending ? (
                    <span className="spinner-sm" />
                  ) : (
                    "Müsait Saatleri Göster"
                  )}
                </button>

                {/* Available Slots Grid */}
                {slots.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-main/5">
                    <h3 className="text-lg font-bold text-main mb-4">
                      Müsait Saatler ({selectedDate})
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                      {slots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2.5 px-3 text-sm font-medium rounded-lg border transition-all duration-200 
                            ${
                              selectedTime === time
                                ? "bg-deep text-white border-deep shadow-md scale-105"
                                : "bg-surface text-main/80 border-main/10 hover:border-deep/30 hover:bg-deep/5"
                            }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>

                    {/* Final Book Button */}
                    {selectedTime && (
                      <div className="mt-8 p-4 bg-completed/10 border border-completed/20 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-completed">
                            Seçilen Randevu: {selectedDate} - {selectedTime}
                          </p>
                          <p className="text-sm text-completed">
                            Süre: {service.duration} Dakika
                          </p>
                        </div>
                        <button
                          onClick={handleFinalBooking}
                          disabled={createAppointment.isPending}
                          className="px-6 py-3 bg-completed text-white font-bold rounded-lg hover:bg-completed/80 shadow-sm transition-colors whitespace-nowrap disabled:bg-completed/50 flex items-center gap-2"
                        >
                          {createAppointment.isPending ? (
                            <>
                              <span className="spinner-sm" />
                              Kaydediliyor...
                            </>
                          ) : (
                            "Onayla ve Kaydet"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {slots.length === 0 && checkAvailability.data && (
                  <div className="mt-8 text-center text-main/60 bg-back p-6 rounded-lg">
                    Seçtiğiniz tarih ve saat için müsaitlik bulunamadı.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </QueryGate>
  );
}

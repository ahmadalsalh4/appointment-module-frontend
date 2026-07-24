import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500 dark:text-red-400">
        <p className="text-xl font-bold">Hizmet bulunamadı.</p>
        <Link
          to="/services"
          className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Hizmetlere Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/services" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Hizmetler
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{service.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: Service Details */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:p-8 lg:sticky lg:top-8">
            {service.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-6">
                {service.category.name}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 text-wrap-balance">
              {service.name}
            </h1>

            <div className="flex items-center text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3 text-indigo-500"
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
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                  Süre
                </p>
                <p className="text-lg font-bold">{service.duration} Dakika</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Bu hizmeti almak için sağdaki formdan uygun bir personel, tarih ve
              saat seçebilirsiniz.
            </p>

            <Link
              to="/services"
              className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              Tüm Hizmetlere Dön
            </Link>
          </div>
        </div>

        {/* RIGHT: Booking Area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
            {/* --- GATE: Check if user is logged in --- */}
            {!token ? (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  Randevu Oluşturmak İçin Giriş Yapın
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Hizmet detaylarını görüntüleyebilirsiniz, ancak randevu almak
                  için üye girişi yapmalısınız.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors"
                >
                  Giriş Yap
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Randevu Oluştur
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Staff Select */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Personel Seçin
                    </label>
                    <select
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100"
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
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Tarih Seçin
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100"
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
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkAvailability.isPending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Müsait Saatleri Göster"
                  )}
                </button>

                {/* Available Slots Grid */}
                {slots.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
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
                                ? "bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-md scale-105"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                            }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>

                    {/* Final Book Button */}
                    {selectedTime && (
                      <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-green-800 dark:text-green-300">
                            Seçilen Randevu: {selectedDate} - {selectedTime}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Süre: {service.duration} Dakika
                          </p>
                        </div>
                        <button
                          onClick={handleFinalBooking}
                          disabled={createAppointment.isPending}
                          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-sm transition-colors whitespace-nowrap disabled:bg-green-400 flex items-center gap-2"
                        >
                          {createAppointment.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
                  <div className="mt-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                    Seçtiğiniz tarih ve saat için müsaitlik bulunamadı.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

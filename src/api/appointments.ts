import api from ".";
import type { StaffAppointmentsFilters } from "../other/types";

export default {
  // Randevuları Getir (Filtrelenebilir)
  getStaffAppointments: async (filters?: StaffAppointmentsFilters) => {
    const res = await api.get("/staff/appointments", { params: filters });
    return res.data;
  },

  // Randevu Detayını Getir
  getStaffAppointmentDetail: async (id: number) => {
    const res = await api.get(`/staff/appointments/${id}`);
    return res.data;
  },

  // Randevu Durumunu Güncelle
  updateAppointmentStatus: async (id: number, statusId: number) => {
    const res = await api.patch(`/staff/appointments/${id}/status`, {
      state_id: statusId, // Dikkat: Screenshot'ta state_id olarak geçiyor
    });
    return res.data;
  },
};

import api from ".";
import type { StaffAppointmentsFilters } from "../other/types";

export default {
  getStaffAppointments: async (filters?: StaffAppointmentsFilters) => {
    const res = await api.get("/staff/appointments", { params: filters });
    return res.data;
  },

  getStaffAppointmentDetail: async (id: number) => {
    const res = await api.get(`/staff/appointments/${id}`);
    return res.data;
  },

  updateAppointmentStatus: async (id: number, statusId: number) => {
    const res = await api.patch(`/staff/appointments/${id}/status`, {
      state_id: statusId,
    });
    return res.data;
  },
};

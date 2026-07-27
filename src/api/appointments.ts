import api from ".";
import type {
  CreateAppointmentBody,
  UpdateAppointmentStateBody,
  GetAvailabilityBody,
  CustomerUpdateAppointmentBody,
  Appointment,
  AvailabilityResponse,
} from "../other/types";

export interface AppointmentFilters {
  date?: string;
  status_id?: string | number;
  staff_id?: string | number;
  customer_name?: string;
  tab?: string;
  sort_by?: string;
  sort_order?: string;
  per_page?: number;
  page?: number;
}

export default {
  // --- PUBLIC ---
  getAvailability: async (data: GetAvailabilityBody): Promise<AvailabilityResponse> => {
    const res = await api.get("/availability", { params: data });
    return res.data;
  },

  // --- CUSTOMER ROUTES ---
  create: async (data: CreateAppointmentBody): Promise<Appointment> => {
    const res = await api.post("/appointments", data);
    return res.data;
  },

  cancel: async (id: number | string): Promise<Appointment> => {
    const res = await api.patch(`/appointments/${id}/cancel`);
    return res.data;
  },

  myAppointments: async (params?: AppointmentFilters) => {
    const res = await api.get("/my-appointments", { params });
    return res.data;
  },

  myAppointmentDetail: async (id: number | string): Promise<Appointment> => {
    const res = await api.get(`/my-appointments/${id}`);
    return res.data;
  },

  updateMyAppointment: async (id: number | string, data: CustomerUpdateAppointmentBody): Promise<Appointment> => {
    const res = await api.put(`/my-appointments/${id}`, data);
    return res.data;
  },

  // --- STAFF ROUTES ---
  staffAppointments: async (params?: AppointmentFilters) => {
    const res = await api.get("/staff/appointments", { params });
    return res.data;
  },

  staffAppointmentDetail: async (id: number | string): Promise<Appointment> => {
    const res = await api.get(`/staff/appointments/${id}`);
    return res.data;
  },

  staffUpdateStatus: async ({ id, data }: { id: number | string; data: UpdateAppointmentStateBody }): Promise<Appointment> => {
    const res = await api.patch(`/staff/appointments/${id}/status`, data);
    return res.data;
  },

  // --- ADMIN ROUTES ---
  adminAppointments: async (params?: AppointmentFilters) => {
    const res = await api.get("/appointments", { params });
    return res.data;
  },

  adminAppointmentDetail: async (id: number | string): Promise<Appointment> => {
    const res = await api.get(`/appointments/${id}`);
    return res.data;
  },

  adminUpdateAppointment: async ({ id, data }: { id: number | string; data: UpdateAppointmentStateBody }): Promise<Appointment> => {
    const res = await api.put(`/appointments/${id}`, data);
    return res.data;
  },

  adminDelete: async (id: number | string) => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  },
};

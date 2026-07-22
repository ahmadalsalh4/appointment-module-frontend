import api from ".";
import type {
  CreateAppointmentBody,
  UpdateAppointmentStateBody,
  GetAvailabilityBody,
} from "../other/types";

export default {
  // --- PUBLIC ---
  getAvailability: async (data: GetAvailabilityBody) => {
    const res = await api.post("/availability", data);
    return res.data;
  },

  // --- CUSTOMER ROUTES ---
  create: async (data: CreateAppointmentBody) => {
    const res = await api.post("/appointments", data);
    return res.data;
  },

  cancel: async (id: number | string) => {
    const res = await api.patch(`/appointments/${id}/cancel`);
    return res.data;
  },

  myAppointments: async () => {
    const res = await api.get("/my-appointments");
    return res.data;
  },

  myAppointmentDetail: async (id: number | string) => {
    const res = await api.get(`/my-appointments/${id}`);
    return res.data;
  },

  // --- STAFF ROUTES ---
  staffAppointments: async () => {
    const res = await api.get("/staff/appointments");
    return res.data;
  },

  staffAppointmentDetail: async (id: number | string) => {
    const res = await api.get(`/staff/appointments/${id}`);
    return res.data;
  },

  staffUpdateStatus: async ({
    id,
    data,
  }: {
    id: number | string;
    data: UpdateAppointmentStateBody;
  }) => {
    const res = await api.patch(`/staff/appointments/${id}/status`, data);
    return res.data;
  },

  // --- ADMIN ROUTES ---
  adminAppointments: async () => {
    const res = await api.get("/appointments");
    return res.data;
  },

  adminAppointmentDetail: async (id: number | string) => {
    const res = await api.get(`/appointments/${id}`);
    return res.data;
  },

  adminUpdateState: async ({
    id,
    data,
  }: {
    id: number | string;
    data: UpdateAppointmentStateBody;
  }) => {
    const res = await api.put(`/appointments/${id}`, data);
    return res.data;
  },

  adminDelete: async (id: number | string) => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  },
};

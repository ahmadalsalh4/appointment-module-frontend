import api from ".";
import type { CreateAppointmentShape } from "../other/types";

export default {
  getServices: async () => {
    const res = await api.get("/customer/services");
    return res.data;
  },

  getServiceDetail: async (id: number) => {
    const res = await api.get(`/customer/services/${id}`);
    return res.data;
  },

  getMyAppointments: async () => {
    const res = await api.get("/customer/appointments");
    return res.data;
  },

  getMyAppointmentDetail: async (id: number) => {
    const res = await api.get(`/customer/appointments/${id}`);
    return res.data;
  },

  createAppointment: async (data: CreateAppointmentShape) => {
    const res = await api.post("/customer/appointments", data);
    return res.data;
  },
};

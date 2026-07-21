import api from ".";
import type { CreateAppointmentShape } from "../other/types";

export default {
  // Hizmetleri Getir
  getServices: async () => {
    const res = await api.get("/customer/services");
    return res.data;
  },

  // Tek Bir Hizmet Detayını Getir
  getServiceDetail: async (id: number) => {
    const res = await api.get(`/customer/services/${id}`);
    return res.data;
  },

  // Müşterinin Kendi Randevularını Getir
  getMyAppointments: async () => {
    const res = await api.get("/customer/appointments");
    return res.data;
  },

  // Randevu Detayı
  getMyAppointmentDetail: async (id: number) => {
    const res = await api.get(`/customer/appointments/${id}`);
    return res.data;
  },

  // Yeni Randevu Oluştur
  createAppointment: async (data: CreateAppointmentShape) => {
    const res = await api.post("/customer/appointments", data);
    return res.data;
  },
};

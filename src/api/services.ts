import api from ".";
import type { ServiceRequestBody } from "../other/types";

export default {
  // PUBLIC
  getAll: async () => {
    const res = await api.get("/services");
    return res.data;
  },

  getById: async (id: number | string) => {
    const res = await api.get(`/services/${id}`);
    return res.data;
  },
  getServiceStaff: async (serviceId: number | string) => {
    const res = await api.get(`/services/${serviceId}/staff`);
    return res.data;
  },

  // ADMIN ONLY
  create: async (data: ServiceRequestBody) => {
    const res = await api.post("/services", data); // apiResource route
    return res.data;
  },

  update: async ({
    id,
    data,
  }: {
    id: number | string;
    data: ServiceRequestBody;
  }) => {
    const res = await api.put(`/services/${id}`, data); // apiResource route
    return res.data;
  },

  delete: async (id: number | string) => {
    const res = await api.delete(`/services/${id}`); // apiResource route
    return res.data;
  },
};

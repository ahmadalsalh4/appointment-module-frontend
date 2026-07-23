import api from ".";
import type { CategoryRequestBody } from "../other/types";

export default {
  // PUBLIC
  getAll: async () => {
    const res = await api.get("/categories");
    return res.data;
  },

  getById: async (id: number | string) => {
    const res = await api.get(`/categories/${id}`);
    return res.data;
  },

  // ADMIN ONLY
  create: async (data: CategoryRequestBody) => {
    const res = await api.post("/categories", data); // apiResource route
    return res.data;
  },

  update: async ({
    id,
    data,
  }: {
    id: number | string;
    data: CategoryRequestBody;
  }) => {
    const res = await api.put(`/categories/${id}`, data); // apiResource route
    return res.data;
  },

  delete: async (id: number | string) => {
    const res = await api.delete(`/categories/${id}`); // apiResource route
    return res.data;
  },
  
  getCategoryStaff: async (categoryId: number | string) => {
    const res = await api.get(`/categories/${categoryId}/staff`);
    return res.data;
  },
};

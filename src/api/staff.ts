import api from ".";
import type {
  CreateStaffRequestBody,
  UpdateStaffRequestBody,
} from "../other/types";

export default {
  // ADMIN ONLY (Uses apiResource('staff-members'))
  getAll: async () => {
    const res = await api.get("/staff-members");
    return res.data;
  },

  getById: async (id: number | string) => {
    const res = await api.get(`/staff-members/${id}`);
    return res.data;
  },

  create: async (data: CreateStaffRequestBody) => {
    const res = await api.post("/staff-members", data);
    return res.data;
  },

  update: async ({
    id,
    data,
  }: {
    id: number | string;
    data: UpdateStaffRequestBody;
  }) => {
    const res = await api.put(`/staff-members/${id}`, data);
    return res.data;
  },

  delete: async (id: number | string) => {
    const res = await api.delete(`/staff-members/${id}`);
    return res.data;
  },
};

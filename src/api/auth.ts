import api from ".";
import type { LoginShape, RegisterShape } from "../other/types";

export default {
  login: async ({ email, password, role }: LoginShape) => {
    const res = await api.post(`/${role}/login`, { email, password });
    return res.data;
  },

  register: async (data: RegisterShape) => {
    const res = await api.post("/customer/register", data);
    return res.data;
  },
};

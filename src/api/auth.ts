import api from ".";
import type { CustomerRegisterBody, LoginBody, LogoutResponse, UserRole } from "../other/types";

export default {
  login: async ({ email, password, role }: LoginBody) => {
    const res = await api.post(`/${role}/login`, { email, password });
    return res.data;
  },

  logout: async (role: UserRole) => {
    const res = await api.post<LogoutResponse>(`/${role}/logout`);
    return res.data;
  },

  register: async (data: CustomerRegisterBody) => {
    const res = await api.post("/customer/register", data);
    return res.data;
  },
};

import api from ".";
import type { Role } from "../other/types";

export type LoginShape = {
  email: string;
  password: string;
  role: Role;
};

export default {
  login: async ({ email, password, role }: LoginShape) => {
    const res = await api.post(`/${role}/login`, { email, password });
    return res.data;
  },
};

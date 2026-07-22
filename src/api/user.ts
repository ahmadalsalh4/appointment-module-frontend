import api from ".";
import type { UserRole } from "../other/types";

export default {
  getProfile: async (role: UserRole) => {
    const res = await api.get(`/${role}/profile`);
    return res.data;
  },
};

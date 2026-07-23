import api from ".";
import type { UserRole, AnyProfileResponse } from "../other/types";

export interface ProfileUpdateBody {
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  phone_number?: string;
  job_title?: string;
}

export default {
  get: async (role: UserRole): Promise<AnyProfileResponse> => {
    if (role === "customer") {
      const res = await api.get("/customer/profile");
      return { role, data: res.data };
    } else if (role === "staff") {
      const res = await api.get("/staff/profile");
      return { role, data: res.data };
    } else {
      const res = await api.get("/admin/profile");
      return { role, data: res.data };
    }
  },

  update: async (role: UserRole, data: ProfileUpdateBody) => {
    let endpoint = "/customer/profile";
    if (role === "staff") endpoint = "/staff/profile";
    if (role === "admin") endpoint = "/admin/profile";

    const res = await api.put(endpoint, data);
    return { role, data: res.data };
  },
};

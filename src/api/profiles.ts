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
    let data: any;

    if (role === "customer") {
      const res = await api.get("/customer/profile");
      data = res.data;
    } else if (role === "staff") {
      const res = await api.get("/staff/profile");
      data = res.data;
    } else if (role === "admin") {
      const res = await api.get("/admin/profile");
      data = res.data;
    }

    return { role, data };
  },

  update: async (role: UserRole, data: ProfileUpdateBody) => {
    let endpoint = "/customer/profile";
    if (role === "staff") endpoint = "/staff/profile";
    if (role === "admin") endpoint = "/admin/profile";

    const res = await api.put(endpoint, data);
    return { role, data: res.data };
  },
};

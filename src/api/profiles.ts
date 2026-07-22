import api from ".";
import type { UserRole, AnyProfileResponse } from "../other/types";

export default {
  get: async (role: UserRole): Promise<AnyProfileResponse> => {
    // We manually wrap the response in our discriminated union shape
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

    // Return the exact shape defined in types.ts: { role: "...", data: {...} }
    return { role, data };
  },
};

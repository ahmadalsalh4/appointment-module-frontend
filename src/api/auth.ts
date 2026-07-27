import api from ".";
import type {
  CustomerRegisterBody,
  LoginBody,
  LogoutResponse,
  UserRole,
  UnifiedLoginBody,
  UnifiedLoginResponse,
  MyRolesResponse,
  SwitchRoleBody,
  SwitchRoleResponse,
} from "../other/types";

export default {
  login: async ({ email, password }: LoginBody | UnifiedLoginBody): Promise<UnifiedLoginResponse> => {
    const res = await api.post("/login", { email, password });
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

  getMyRoles: async (): Promise<MyRolesResponse> => {
    const res = await api.get("/me/roles");
    return res.data;
  },

  switchRole: async (data: SwitchRoleBody): Promise<SwitchRoleResponse> => {
    const res = await api.post("/switch-role", data);
    return res.data;
  },
};

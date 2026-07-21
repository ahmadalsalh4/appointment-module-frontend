import api from ".";
import type { Role } from "../other/types";

export type LoginShape = {
  email: string;
  password: string;
  role: Role;
};
export type LoginResponse = {
  token: string;
  role: Role;
  customer: {
    person: {
      name: string;
      surname: string;
    };
  };
};

export interface RegisterShape {
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
  };
}

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

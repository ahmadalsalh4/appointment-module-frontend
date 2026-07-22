import { useMutation } from "@tanstack/react-query";
import authApi from "../api/auth";
import type { AxiosError } from "axios";
import type {
  LaravelErrorResponse,
  LoginResponse,
  LoginShape,
  LogoutResponse,
  RegisterShape,
  Role,
} from "../other/types";

export const useLoginMutation = () => {
  return useMutation<
    LoginResponse,
    AxiosError<LaravelErrorResponse>,
    LoginShape
  >({
    mutationFn: async (formData) => {
      const res = await authApi.login(formData);
      return res;
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation<LogoutResponse, AxiosError<LaravelErrorResponse>, Role>({
    mutationFn: async (role) => {
      const res = await authApi.logout(role);
      return res;
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("Logout başarısız:", error.response?.data);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation<
    LoginResponse,
    AxiosError<LaravelErrorResponse>,
    RegisterShape
  >({
    mutationFn: async (formData) => {
      const res = await authApi.register(formData);
      return res;
    },
  });
};

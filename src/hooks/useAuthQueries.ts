import { useMutation } from "@tanstack/react-query";
import authApi from "../api/auth";
import type { AxiosError } from "axios";
import type {
  CustomerAuthResponse, CustomerRegisterBody, LaravelErrorResponse,
  LoginBody, UnifiedLoginResponse, LogoutResponse, UserRole,
} from "../other/types";

export const useLoginMutation = () => {
  return useMutation<UnifiedLoginResponse, AxiosError<LaravelErrorResponse>, Pick<LoginBody, 'email' | 'password'>>({
    mutationFn: async (formData) => {
      const res = await authApi.login(formData);
      return res;
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation<LogoutResponse, AxiosError<LaravelErrorResponse>, UserRole>({
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
  return useMutation<CustomerAuthResponse, AxiosError<LaravelErrorResponse>, CustomerRegisterBody>({
    mutationFn: async (formData) => {
      const res = await authApi.register(formData);
      return res;
    },
  });
};

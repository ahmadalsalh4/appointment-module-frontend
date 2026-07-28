import { useMutation, useQueryClient } from "@tanstack/react-query";
import authApi from "../api/auth";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";
import type {
  CustomerAuthResponse,
  CustomerRegisterBody,
  LaravelErrorResponse,
  LoginBody,
  UnifiedLoginResponse,
  LogoutResponse,
  UserRole,
} from "../other/types";

export const useLoginMutation = () => {
  return useMutation<UnifiedLoginResponse, AxiosError<LaravelErrorResponse>, Pick<LoginBody, "email" | "password">>({
    mutationFn: async (formData) => {
      const res = await authApi.login(formData);
      return res;
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<LogoutResponse, AxiosError<LaravelErrorResponse>, UserRole>({
    mutationFn: async (role) => {
      const res = await authApi.logout(role);
      return res;
    },
    // Use onSettled (not onSuccess) so the local state is always cleaned
    // up, even if the server-side logout call failed (e.g. expired
    // token, network error). The previous code only cleaned up on
    // success, leaving the token in localStorage on failure.
    onSettled: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      queryClient.clear();
      window.dispatchEvent(new CustomEvent("auth:logout"));
      navigate("/login", { replace: true });
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

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
import { useAuth } from "../contexts/auth/useAuth";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UnifiedLoginResponse, AxiosError<LaravelErrorResponse>, Pick<LoginBody, "email" | "password">>({
    mutationFn: async (formData) => {
      const res = await authApi.login(formData);
      return res;
    },
    onSuccess: () => {
      // Invalidate me-roles so the Sidebar's switch-role affordance
      // refreshes immediately after login (previously it stayed empty
      // until the user manually opened the dialog).
      queryClient.invalidateQueries({ queryKey: ["auth", "me-roles"] });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { token, handleLogout } = useAuth();

  return useMutation<LogoutResponse, AxiosError<LaravelErrorResponse>, UserRole>({
    mutationFn: async (role) => {
      const res = await authApi.logout(role);
      return res;
    },
    // Use onSettled (not onSuccess) so the local state is always cleaned
    // up, even if the server-side logout call failed (e.g. expired
    // token, network error). The previous implementation used a global
    // window event; now we call handleLogout() directly through context
    // so the interceptor's auth consumer doesn't need to know about it.
    onSettled: () => {
      // Guard against the interceptor's onUnauthorized already having
      // logged us out (token === null). Otherwise we'd double-navigate
      // and double-clear.
      if (token) {
        handleLogout();
        queryClient.clear();
        navigate("/login", { replace: true });
      }
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
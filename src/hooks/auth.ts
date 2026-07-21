import { useMutation } from "@tanstack/react-query";
import authApi from "../api/auth";
import type { LoginResponse, LoginShape, RegisterShape } from "../api/auth";
import type { AxiosError } from "axios";


export interface LaravelErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

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

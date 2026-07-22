import { useMutation } from "@tanstack/react-query";
import authApi from "../api/auth";
import type { AxiosError } from "axios";
import type {
  LaravelErrorResponse,
  LoginResponse,
  LoginShape,
  RegisterShape,
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

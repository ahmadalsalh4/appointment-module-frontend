import { useMutation } from "@tanstack/react-query";
import authService, { type LoginShape } from "../api/auth";
export function useLoginMutation() {
  const mutation = useMutation({
    mutationFn: ({ email, password, role }: LoginShape) => {
      return authService.login({ email, password, role });
    },
  });
  return mutation;
}

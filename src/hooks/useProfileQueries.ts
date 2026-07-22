import { useMutation, useQuery } from "@tanstack/react-query";
import profilesApi, { type ProfileUpdateBody } from "../api/profiles";
import type { AxiosError } from "axios";
import type {
  AnyProfileResponse,
  LaravelErrorResponse,
  UserRole,
} from "../other/types";

export const useGetProfileQuery = (role: UserRole | null) => {
  return useQuery<AnyProfileResponse, AxiosError<LaravelErrorResponse>>({
    queryKey: ["profile", role],
    queryFn: async () => {
      if (!role) throw new Error("No role provided");
      return await profilesApi.get(role);
    },
    enabled: !!role, // Don't run if we don't know the role yet
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation<
    AnyProfileResponse,
    AxiosError<LaravelErrorResponse>,
    { role: UserRole; data: ProfileUpdateBody }
  >({
    mutationFn: async ({ role, data }) => {
      return await profilesApi.update(role, data);
    },
  });
};

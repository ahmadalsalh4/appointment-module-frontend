import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    enabled: !!role,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AnyProfileResponse,
    AxiosError<LaravelErrorResponse>,
    { role: UserRole; data: ProfileUpdateBody }
  >({
    mutationFn: async ({ role, data }) => {
      return await profilesApi.update(role, data);
    },
    onSuccess: (_data, variables) => {
      // The profile query stays stale until we explicitly invalidate it;
      // before this fix the UI kept showing the old name/email until
      // a manual refresh.
      queryClient.invalidateQueries({ queryKey: ["profile", variables.role] });
    },
  });
};

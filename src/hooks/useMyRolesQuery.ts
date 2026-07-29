import { useQuery } from "@tanstack/react-query";
import authApi from "../api/auth";
import { useAuth } from "../contexts/auth/useAuth";
import type { AxiosError } from "axios";
import type { LaravelErrorResponse, MyRolesResponse } from "../other/types";

export const useMyRolesQuery = () => {
  // Read auth state from context (reactive) rather than localStorage
  // (which fires `enabled` on every render but only re-evaluates when
  // some other state changes). When the user logs in via another tab,
  // the storage event listener in useAuth sync still needs to be
  // wired up separately; for now this fixes the same-tab lag.
  const { token } = useAuth();

  return useQuery<MyRolesResponse, AxiosError<LaravelErrorResponse>>({
    queryKey: ["auth", "me-roles"],
    queryFn: () => authApi.getMyRoles(),
    enabled: !!token,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
};
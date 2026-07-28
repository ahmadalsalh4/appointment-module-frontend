import { useQuery } from "@tanstack/react-query";
import authApi from "../api/auth";
import type { AxiosError } from "axios";
import type { LaravelErrorResponse, MyRolesResponse } from "../other/types";

export const useMyRolesQuery = () =>
  useQuery<MyRolesResponse, AxiosError<LaravelErrorResponse>>({
    queryKey: ["auth", "me-roles"],
    queryFn: () => authApi.getMyRoles(),
    staleTime: 60_000,
  });

import { useQuery } from "@tanstack/react-query";
import authApi from "../api/auth";
import type { AxiosError } from "axios";
import type { LaravelErrorResponse, MyRolesResponse } from "../other/types";

export const useMyRolesQuery = () =>
  useQuery<MyRolesResponse, AxiosError<LaravelErrorResponse>>({
    queryKey: ["auth", "me-roles"],
    queryFn: () => authApi.getMyRoles(),
    // Don't fire for guests — that previously caused a 401 → hard
    // redirect to /login on any public page that included the sidebar.
    enabled: !!localStorage.getItem("token"),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

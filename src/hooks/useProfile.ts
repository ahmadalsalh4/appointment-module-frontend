import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import userApi from "../api/user";
import type { ProfileShape, Role } from "../other/types";
import type { LaravelErrorResponse } from "./auth";

export const useProfile = (role: Role) => {
  return useQuery<ProfileShape, AxiosError<LaravelErrorResponse>>({
    // Include role in the key so it caches separately for customer, staff, admin
    queryKey: ["profile", role],

    // Pass the role to the API call
    queryFn: () => userApi.getProfile(role || "customer"),

    // Don't run the query if there is no role (user is not logged in)
    enabled: !!role,
  });
};

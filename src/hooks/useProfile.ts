import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import userApi from "../api/user";
import type {
  LaravelErrorResponse,
  ProfileShape,
  Role,
} from "../other/typesold";

export const useProfile = (role: Role) => {
  return useQuery<ProfileShape, AxiosError<LaravelErrorResponse>>({
    queryKey: ["profile", role],

    queryFn: () => userApi.getProfile(role || "customer"),

    enabled: !!role,
  });
};

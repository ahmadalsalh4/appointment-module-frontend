import { useMutation, useQuery } from "@tanstack/react-query";
import staffApi from "../api/staff";
import type { AxiosError } from "axios";
import type {
  StaffEntity,
  StaffEntityDetailed,
  CreateStaffRequestBody,
  UpdateStaffRequestBody,
  UpdateStaffResponse,
  DeleteStaffResponse,
  LaravelErrorResponse,
} from "../other/types";

export const useGetAllStaffQuery = () => {
  return useQuery<StaffEntity[], AxiosError<LaravelErrorResponse>>({
    queryKey: ["staff"],
    queryFn: async () => {
      return await staffApi.getAll();
    },
  });
};

export const useGetStaffByIdQuery = (id: number | string) => {
  return useQuery<StaffEntityDetailed, AxiosError<LaravelErrorResponse>>({
    queryKey: ["staff", id],
    queryFn: async () => {
      return await staffApi.getById(id);
    },
    enabled: !!id,
  });
};

export const useCreateStaffMutation = () => {
  return useMutation<
    StaffEntity,
    AxiosError<LaravelErrorResponse>,
    CreateStaffRequestBody
  >({
    mutationFn: async (data) => {
      return await staffApi.create(data);
    },
  });
};

export const useUpdateStaffMutation = () => {
  return useMutation<
    UpdateStaffResponse,
    AxiosError<LaravelErrorResponse>,
    { id: number | string; data: UpdateStaffRequestBody }
  >({
    mutationFn: async ({ id, data }) => {
      return await staffApi.update({ id, data });
    },
  });
};

export const useDeleteStaffMutation = () => {
  return useMutation<
    DeleteStaffResponse,
    AxiosError<LaravelErrorResponse>,
    number | string
  >({
    mutationFn: async (id) => {
      return await staffApi.delete(id);
    },
  });
};

import { useMutation, useQuery } from "@tanstack/react-query";
import servicesApi from "../api/services";
import type { AxiosError } from "axios";
import type {
  Service,
  ServiceWithCategory,
  ServiceRequestBody,
  DeleteServiceResponse,
  LaravelErrorResponse,
  StaffEntity,
} from "../other/types";

export const useGetAllServicesQuery = () => {
  return useQuery<ServiceWithCategory[], AxiosError<LaravelErrorResponse>>({
    queryKey: ["services"],
    queryFn: async () => {
      return await servicesApi.getAll();
    },
  });
};

export const useGetServiceByIdQuery = (id: number | string) => {
  return useQuery<ServiceWithCategory, AxiosError<LaravelErrorResponse>>({
    queryKey: ["services", id],
    queryFn: async () => {
      return await servicesApi.getById(id);
    },
    enabled: !!id,
  });
};

export const useCreateServiceMutation = () => {
  return useMutation<
    ServiceWithCategory,
    AxiosError<LaravelErrorResponse>,
    ServiceRequestBody
  >({
    mutationFn: async (data) => {
      return await servicesApi.create(data);
    },
  });
};

export const useUpdateServiceMutation = () => {
  return useMutation<
    Service,
    AxiosError<LaravelErrorResponse>,
    { id: number | string; data: ServiceRequestBody }
  >({
    mutationFn: async ({ id, data }) => {
      return await servicesApi.update({ id, data });
    },
  });
};

export const useDeleteServiceMutation = () => {
  return useMutation<
    DeleteServiceResponse,
    AxiosError<LaravelErrorResponse>,
    number | string
  >({
    mutationFn: async (id) => {
      return await servicesApi.delete(id);
    },
  });
};
export const useGetServiceStaffQuery = (serviceId: string | number) => {
  return useQuery<StaffEntity[], AxiosError<LaravelErrorResponse>>({
    queryKey: ["services", serviceId, "staff"],
    queryFn: async () => {
      return await servicesApi.getServiceStaff(serviceId);
    },
    enabled: !!serviceId, // Always fetch if we have an ID (it's a public endpoint)
  });
};

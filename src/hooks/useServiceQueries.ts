import { useQuery } from "@tanstack/react-query";
import servicesApi from "../api/services";
import { createCrudHooks } from "./crudQueries";
import type { AxiosError } from "axios";
import type {
  Service,
  ServiceWithCategory,
  ServiceRequestBody,
  DeleteServiceResponse,
  LaravelErrorResponse,
  StaffEntity,
} from "../other/types";

const {
  useGetAllQuery: _useGetAll,
  useGetByIdQuery: _useGetById,
  useCreateMutation: _useCreate,
  useUpdateMutation: _useUpdate,
  useDeleteMutation: _useDelete,
} = createCrudHooks(servicesApi, "services");

export const useGetAllServicesQuery = (params?: Record<string, unknown>) => _useGetAll<ServiceWithCategory>(params);
export const useGetServiceByIdQuery = (id: number | string) =>
  _useGetById<ServiceWithCategory>(id);
export const useCreateServiceMutation = () =>
  _useCreate<ServiceWithCategory, ServiceRequestBody>();
export const useUpdateServiceMutation = () =>
  _useUpdate<Service, ServiceRequestBody>();
export const useDeleteServiceMutation = () =>
  _useDelete<DeleteServiceResponse>();

export const useGetServiceStaffQuery = (serviceId: string | number) =>
  useQuery<StaffEntity[], AxiosError<LaravelErrorResponse>>({
    queryKey: ["services", serviceId, "staff"],
    queryFn: () => servicesApi.getServiceStaff(serviceId),
    enabled: !!serviceId,
  });

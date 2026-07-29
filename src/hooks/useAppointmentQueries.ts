import { useMutation, useQuery } from "@tanstack/react-query";
import appointmentsApi, { type AppointmentFilters } from "../api/appointments";

import type { AxiosError } from "axios";
import type {
  Appointment,
  CreateAppointmentBody,
  UpdateAppointmentStateBody,
  GetAvailabilityBody,
  CustomerUpdateAppointmentBody,
  AvailabilityResponse,
  LaravelErrorResponse,
  PaginatedResponse,
} from "../other/types";

// --- CUSTOMER HOOKS ---
export const useCustomerGetAppointmentsQuery = (params?: AppointmentFilters) => {
  return useQuery<PaginatedResponse<Appointment>, AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "customer", params],
    queryFn: async () => {
      return await appointmentsApi.myAppointments(params);
    },
  });
};

export const useCustomerGetAppointmentByIdQuery = (id: number | string) => {
  return useQuery<Appointment, AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "customer", id],
    queryFn: async () => {
      return await appointmentsApi.myAppointmentDetail(id);
    },
    enabled: !!id,
  });
};

export const useCreateAppointmentMutation = () => {
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, CreateAppointmentBody>({
    mutationFn: async (data) => {
      return await appointmentsApi.create(data);
    },
  });
};

export const useCancelAppointmentMutation = () => {
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, number | string>({
    mutationFn: async (id) => {
      return await appointmentsApi.cancel(id);
    },
  });
};

export const useUpdateMyAppointmentMutation = () => {
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, { id: number | string; data: CustomerUpdateAppointmentBody }>({
    mutationFn: async ({ id, data }) => {
      return await appointmentsApi.updateMyAppointment(id, data);
    },
  });
};

// --- STAFF HOOKS ---
export const useStaffGetAppointmentsQuery = (params?: AppointmentFilters) => {
  return useQuery<PaginatedResponse<Appointment>, AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "staff", params],
    queryFn: async () => {
      return await appointmentsApi.staffAppointments(params);
    },
  });
};

export const useStaffGetAppointmentByIdQuery = (id: number | string) => {
  return useQuery<Appointment, AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "staff", id],
    queryFn: async () => {
      return await appointmentsApi.staffAppointmentDetail(id);
    },
    enabled: !!id,
  });
};

export const useStaffUpdateStateMutation = () => {
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, { id: number | string; data: UpdateAppointmentStateBody }>({
    mutationFn: async ({ id, data }) => {
      return await appointmentsApi.staffUpdateStatus({ id, data });
    },
  });
};

// --- ADMIN HOOKS ---
export const useAdminGetAppointmentsQuery = (params?: AppointmentFilters) => {
  return useQuery<PaginatedResponse<Appointment>, AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "admin", params],
    queryFn: async () => {
      return await appointmentsApi.adminAppointments(params);
    },
  });
};

export const useAdminGetAppointmentByIdQuery = (id: number | string) => {
  return useQuery<Appointment, AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "admin", id],
    queryFn: async () => {
      return await appointmentsApi.adminAppointmentDetail(id);
    },
    enabled: !!id,
  });
};

export const useAdminUpdateAppointmentMutation = () => {
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, { id: number | string; data: UpdateAppointmentStateBody }>({
    mutationFn: async ({ id, data }) => {
      return await appointmentsApi.adminUpdateAppointment({ id, data });
    },
  });
};

export const useAdminDeleteAppointmentMutation = () => {
  return useMutation<{ message: string }, AxiosError<LaravelErrorResponse>, number | string>({
    mutationFn: async (id) => {
      return await appointmentsApi.adminDelete(id);
    },
  });
};

// --- SHARED/PUBLIC HOOKS ---
/**
 * Public availability query. Implemented as a useQuery (not useMutation)
 * so the result can be invalidated and cached by key. Previously a
 * mutation, the slot picker would display stale data after a successful
 * booking until the next manual refresh — leading to subsequent
 * POST /appointments requests that returned 409 even though the
 * backend response was correct.
 */
export const useGetAvailabilityQuery = (
  params: GetAvailabilityBody,
  options?: { enabled?: boolean },
) => {
  return useQuery<AvailabilityResponse, AxiosError<LaravelErrorResponse>>({
    queryKey: ["availability", params.staff_id, params.service_id, params.date],
    queryFn: async () => {
      return await appointmentsApi.getAvailability(params);
    },
    enabled: options?.enabled ?? !!(params.staff_id && params.service_id && params.date),
  });
};

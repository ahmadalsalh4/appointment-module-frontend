import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

// Shared query-key prefixes for cross-role invalidation. A customer
// booking should refresh every "appointments" cache (admin/staff too),
// not just the customer's. Centralising the prefix avoids a typo
// silently no-op'ing an invalidate.
const APPOINTMENT_KEYS = ["appointments"] as const;

// --- CUSTOMER HOOKS ---
export const useCustomerGetAppointmentsQuery = (params?: AppointmentFilters) => {
  return useQuery<PaginatedResponse<Appointment>, AxiosError<LaravelErrorResponse>>({
    queryKey: [...APPOINTMENT_KEYS, "customer", params],
    queryFn: async () => {
      return await appointmentsApi.myAppointments(params);
    },
  });
};

export const useCustomerGetAppointmentByIdQuery = (id: number | string) => {
  return useQuery<Appointment, AxiosError<LaravelErrorResponse>>({
    queryKey: [...APPOINTMENT_KEYS, "customer", id],
    queryFn: async () => {
      return await appointmentsApi.myAppointmentDetail(id);
    },
    enabled: !!id,
  });
};

export const useCreateAppointmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, CreateAppointmentBody>({
    mutationFn: async (data) => {
      return await appointmentsApi.create(data);
    },
    onSuccess: () => {
      // Refresh every appointment cache slot AND every availability
      // slot lookup so the just-booked slot disappears everywhere.
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, number | string>({
    mutationFn: async (id) => {
      return await appointmentsApi.cancel(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};

export const useUpdateMyAppointmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, { id: number | string; data: CustomerUpdateAppointmentBody }>({
    mutationFn: async ({ id, data }) => {
      return await appointmentsApi.updateMyAppointment(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};

// --- STAFF HOOKS ---
export const useStaffGetAppointmentsQuery = (params?: AppointmentFilters) => {
  return useQuery<PaginatedResponse<Appointment>, AxiosError<LaravelErrorResponse>>({
    queryKey: [...APPOINTMENT_KEYS, "staff", params],
    queryFn: async () => {
      return await appointmentsApi.staffAppointments(params);
    },
  });
};

export const useStaffGetAppointmentByIdQuery = (id: number | string) => {
  return useQuery<Appointment, AxiosError<LaravelErrorResponse>>({
    queryKey: [...APPOINTMENT_KEYS, "staff", id],
    queryFn: async () => {
      return await appointmentsApi.staffAppointmentDetail(id);
    },
    enabled: !!id,
  });
};

export const useStaffUpdateStateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, { id: number | string; data: UpdateAppointmentStateBody }>({
    mutationFn: async ({ id, data }) => {
      return await appointmentsApi.staffUpdateStatus({ id, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS });
    },
  });
};

// --- ADMIN HOOKS ---
export const useAdminGetAppointmentsQuery = (params?: AppointmentFilters) => {
  return useQuery<PaginatedResponse<Appointment>, AxiosError<LaravelErrorResponse>>({
    queryKey: [...APPOINTMENT_KEYS, "admin", params],
    queryFn: async () => {
      return await appointmentsApi.adminAppointments(params);
    },
  });
};

export const useAdminGetAppointmentByIdQuery = (id: number | string) => {
  return useQuery<Appointment, AxiosError<LaravelErrorResponse>>({
    queryKey: [...APPOINTMENT_KEYS, "admin", id],
    queryFn: async () => {
      return await appointmentsApi.adminAppointmentDetail(id);
    },
    enabled: !!id,
  });
};

export const useAdminUpdateAppointmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Appointment, AxiosError<LaravelErrorResponse>, { id: number | string; data: UpdateAppointmentStateBody }>({
    mutationFn: async ({ id, data }) => {
      return await appointmentsApi.adminUpdateAppointment({ id, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};

export const useAdminDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, AxiosError<LaravelErrorResponse>, number | string>({
    mutationFn: async (id) => {
      return await appointmentsApi.adminDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
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
    // 30s stale time: switching tabs and back doesn't refetch, but a
    // new key (different staff/date/service) always fetches.
    staleTime: 30_000,
  });
};
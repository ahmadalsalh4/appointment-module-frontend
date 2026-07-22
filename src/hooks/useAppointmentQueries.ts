import { useMutation, useQuery } from "@tanstack/react-query";
import appointmentsApi, { type AppointmentFilters } from "../api/appointments";

import type { AxiosError } from "axios";
import type {
  Appointment,
  CreateAppointmentBody,
  UpdateAppointmentStateBody,
  GetAvailabilityBody,
  CancelAppointmentResponse,
  DeleteAppointmentResponse,
  AvailabilityResponse,
  LaravelErrorResponse,
} from "../other/types";

// --- CUSTOMER HOOKS ---
export const useCustomerGetAppointmentsQuery = (params?: AppointmentFilters) => {
  return useQuery<Appointment[], AxiosError<LaravelErrorResponse>>({
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
  return useMutation<
    Appointment,
    AxiosError<LaravelErrorResponse>,
    CreateAppointmentBody
  >({
    mutationFn: async (data) => {
      return await appointmentsApi.create(data);
    },
  });
};

export const useCancelAppointmentMutation = () => {
  return useMutation<
    CancelAppointmentResponse,
    AxiosError<LaravelErrorResponse>,
    number | string
  >({
    mutationFn: async (id) => {
      return await appointmentsApi.cancel(id);
    },
  });
};

// --- STAFF HOOKS ---
export const useStaffGetAppointmentsQuery = (params?: AppointmentFilters) => {
  return useQuery<Appointment[], AxiosError<LaravelErrorResponse>>({
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
  return useMutation<
    Appointment,
    AxiosError<LaravelErrorResponse>,
    { id: number | string; data: UpdateAppointmentStateBody }
  >({
    mutationFn: async ({ id, data }) => {
      return await appointmentsApi.staffUpdateStatus({ id, data });
    },
  });
};

// --- ADMIN HOOKS ---
export const useAdminGetAppointmentsQuery = (params?: AppointmentFilters) => {
  return useQuery<Appointment[], AxiosError<LaravelErrorResponse>>({
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

export const useAdminUpdateStateMutation = () => {
  return useMutation<
    Appointment,
    AxiosError<LaravelErrorResponse>,
    { id: number | string; data: UpdateAppointmentStateBody }
  >({
    mutationFn: async ({ id, data }) => {
      return await appointmentsApi.adminUpdateState({ id, data });
    },
  });
};

export const useAdminDeleteAppointmentMutation = () => {
  return useMutation<
    DeleteAppointmentResponse,
    AxiosError<LaravelErrorResponse>,
    number | string
  >({
    mutationFn: async (id) => {
      return await appointmentsApi.adminDelete(id);
    },
  });
};

// --- SHARED/PUBLIC HOOKS ---
export const useGetAvailabilityMutation = () => {
  return useMutation<
    AvailabilityResponse,
    AxiosError<LaravelErrorResponse>,
    GetAvailabilityBody
  >({
    mutationFn: async (data) => {
      return await appointmentsApi.getAvailability(data);
    },
  });
};

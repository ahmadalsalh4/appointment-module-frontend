import { useMutation, useQuery } from "@tanstack/react-query";
import appointmentsApi from "../api/appointments";

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
export const useCustomerGetAppointmentsQuery = () => {
  return useQuery<Appointment[], AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "customer"],
    queryFn: async () => {
      return await appointmentsApi.myAppointments(); // DÜZELTİLDİ
    },
  });
};

export const useCustomerGetAppointmentByIdQuery = (id: number | string) => {
  return useQuery<Appointment, AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "customer", id],
    queryFn: async () => {
      return await appointmentsApi.myAppointmentDetail(id); // DÜZELTİLDİ
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
      return await appointmentsApi.create(data); // DÜZELTİLDİ
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
      return await appointmentsApi.cancel(id); // DÜZELTİLDİ
    },
  });
};

// --- STAFF HOOKS ---
export const useStaffGetAppointmentsQuery = () => {
  return useQuery<Appointment[], AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "staff"],
    queryFn: async () => {
      return await appointmentsApi.staffAppointments(); // DÜZELTİLDİ
    },
  });
};

export const useStaffGetAppointmentByIdQuery = (id: number | string) => {
  return useQuery<Appointment, AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "staff", id],
    queryFn: async () => {
      return await appointmentsApi.staffAppointmentDetail(id); // DÜZELTİLDİ
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
      return await appointmentsApi.staffUpdateStatus({ id, data }); // DOĞRU
    },
  });
};

// --- ADMIN HOOKS ---
export const useAdminGetAppointmentsQuery = () => {
  return useQuery<Appointment[], AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "admin"],
    queryFn: async () => {
      return await appointmentsApi.adminAppointments(); // DÜZELTİLDİ
    },
  });
};

export const useAdminGetAppointmentByIdQuery = (id: number | string) => {
  return useQuery<Appointment, AxiosError<LaravelErrorResponse>>({
    queryKey: ["appointments", "admin", id],
    queryFn: async () => {
      return await appointmentsApi.adminAppointmentDetail(id); // DÜZELTİLDİ
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
      return await appointmentsApi.adminUpdateState({ id, data }); // DOĞRU
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
      return await appointmentsApi.adminDelete(id); // DOĞRU
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
      return await appointmentsApi.getAvailability(data); // DOĞRU
    },
  });
};

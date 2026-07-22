import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import customerApi from "../api/customer";
import type { CreateAppointmentShape } from "../other/types";
import type { LaravelErrorResponse } from "./useAuth";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: customerApi.getServices,
  });
};

export const useServiceDetail = (id: number) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => customerApi.getServiceDetail(id),
    enabled: !!id,
  });
};

export const useMyAppointments = () => {
  return useQuery({
    queryKey: ["myAppointments"],
    queryFn: customerApi.getMyAppointments,
  });
};

export const useMyAppointmentDetail = (id: number) => {
  return useQuery({
    queryKey: ["myAppointment", id],
    queryFn: () => customerApi.getMyAppointmentDetail(id),
    enabled: !!id,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation<
    any,
    AxiosError<LaravelErrorResponse>,
    CreateAppointmentShape
  >({
    mutationFn: customerApi.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
    },
  });
};

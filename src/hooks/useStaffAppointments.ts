import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import appointmentsApi from "../api/appointments";
import type {
  StaffAppointmentsFilters,
  StaffAppointmentDetail,
} from "../other/types";

export const useStaffAppointments = (filters?: StaffAppointmentsFilters) => {
  return useQuery({
    queryKey: ["staffAppointments", filters],
    queryFn: () => appointmentsApi.getStaffAppointments(filters),
  });
};

export const useStaffAppointmentDetail = (id: number) => {
  return useQuery<StaffAppointmentDetail, AxiosError>({
    queryKey: ["staffAppointment", id],
    queryFn: () => appointmentsApi.getStaffAppointmentDetail(id),
    enabled: !!id, // Sadece id varsa çek
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statusId }: { id: number; statusId: number }) =>
      appointmentsApi.updateAppointmentStatus(id, statusId),
    onSuccess: () => {
      // Durum güncellendiğinde listeyi otomatik yenile
      queryClient.invalidateQueries({ queryKey: ["staffAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["staffAppointment"] });
    },
  });
};

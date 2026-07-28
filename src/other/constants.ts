export const APPOINTMENT_STATUS = {
  PENDING: 1,
  CONFIRMED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
} as const;

export type AppointmentStatusId =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export type AppointmentStatusName = "pending" | "confirmed" | "completed" | "cancelled";

export const STATUS_NAME_BY_ID: Record<AppointmentStatusId, AppointmentStatusName> = {
  [APPOINTMENT_STATUS.PENDING]: "pending",
  [APPOINTMENT_STATUS.CONFIRMED]: "confirmed",
  [APPOINTMENT_STATUS.COMPLETED]: "completed",
  [APPOINTMENT_STATUS.CANCELLED]: "cancelled",
};

export const STATUS_ID_BY_NAME: Record<AppointmentStatusName, AppointmentStatusId> = {
  pending: APPOINTMENT_STATUS.PENDING,
  confirmed: APPOINTMENT_STATUS.CONFIRMED,
  completed: APPOINTMENT_STATUS.COMPLETED,
  cancelled: APPOINTMENT_STATUS.CANCELLED,
};

export const STATUS_LABELS: Record<AppointmentStatusName, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  completed: "Tamamlanan",
  cancelled: "İptal Edildi",
};

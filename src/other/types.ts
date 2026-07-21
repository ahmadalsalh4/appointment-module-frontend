export type Role = "staff" | "admin" | "customer";

export interface LaravelErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

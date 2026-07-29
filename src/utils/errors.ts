import axios from "axios";
import type { AxiosError } from "axios";
import type { LaravelErrorResponse } from "../other/types";

/**
 * Extract a human-readable error message from any thrown value,
 * preferring Laravel's structured validation response.
 */
export function getErrorMessage(
  err: unknown,
  fallback = "Bir hata oluştu",
): string {
  if (axios.isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(err)) {
    const data = err.response?.data;
    if (data?.message) return data.message;
    if (data?.errors) {
      // Flatten first error from each field
      const first = Object.values(data.errors)[0]?.[0];
      if (first) return first;
    }
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

/**
 * True if the error is a Laravel 422 (validation) response.
 */
export function isValidationError(
  err: unknown,
): err is AxiosError<LaravelErrorResponse> {
  return axios.isAxiosError<LaravelErrorResponse>(err) && err.response?.status === 422;
}
// src/lib/axios.ts
import Axios, { AxiosError } from "axios";
import { getAccessToken } from "./tokens";

export const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token + normalize outgoing request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Strip Axios noise, surface a clean Error with server message
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      (error.message === "Network Error"
        ? "Network error — please check your connection."
        : "Something went wrong.");

    if (status === 401) {
      // kick off refresh-token flow or redirect to /login
    }

    return Promise.reject(new Error(message)); // React Query needs a rejected promise
  },
);

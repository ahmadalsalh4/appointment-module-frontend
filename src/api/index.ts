import axios, { type AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://appointment_module_backend.test/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// NOTE: We store the bearer token in localStorage because the backend
// currently uses Sanctum token (not cookie) auth. This is XSS-exfiltratable;
// a real hardening would move the token to an httpOnly cookie set by the
// backend (BFF or Sanctum SPA mode with withCredentials). In the meantime
// we mitigate the worst foot-guns:
//
// 1. Only log out on 401, never on 403 (403 means "wrong role", not
//    "invalid token").
// 2. Skip the redirect when the 401 comes from the login endpoint itself
//    (a bad password must not loop you to /login).
// 3. Use react-router's navigate, not window.location, so we don't blow
//    away in-flight React state.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_FREE_PATHS = [
  "/login",
  "/customer/register",
];

/**
 * Consumer hook installed by the AuthProvider at app startup. This avoids
 * the previous `window.dispatchEvent('auth:logout')` plumbing — the
 * AuthProvider subscribes a real callback so the interceptor doesn't need
 * to know about React or react-router.
 */
export type AuthConsumer = {
  onUnauthorized?: () => void;
};

let authConsumer: AuthConsumer = {};

export function setAuthConsumer(consumer: AuthConsumer): void {
  authConsumer = consumer;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";

    if (status === 401 && localStorage.getItem("token")) {
      const isAuthFree = AUTH_FREE_PATHS.some((p) => requestUrl.includes(p));
      if (isAuthFree) {
        return Promise.reject(error);
      }
      authConsumer.onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);

export default api;

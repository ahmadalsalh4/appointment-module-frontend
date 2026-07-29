import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { LaravelErrorResponse, PaginatedResponse } from "../other/types";

interface CrudApi {
  getAll: (params?: Record<string, unknown>) => Promise<unknown>;
  getById: (id: number | string) => Promise<unknown>;
  create: (data: unknown) => Promise<unknown>;
  update: (params: { id: number | string; data: unknown }) => Promise<unknown>;
  delete: (id: number | string) => Promise<unknown>;
}

export function createCrudHooks(api: CrudApi, key: string) {
  const useGetAllQuery = <T>(params?: Record<string, unknown>) =>
    useQuery<PaginatedResponse<T>, AxiosError<LaravelErrorResponse>>({
      queryKey: [key, params],
      queryFn: () => api.getAll(params) as Promise<PaginatedResponse<T>>,
      // Default 30s stale time keeps the dashboard list snappy on
      // navigation without flooding the backend on every mount.
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    });

  const useGetByIdQuery = <T>(id: number | string) =>
    useQuery<T, AxiosError<LaravelErrorResponse>>({
      queryKey: [key, id],
      queryFn: () => api.getById(id) as Promise<T>,
      enabled: !!id,
      staleTime: 30_000,
    });

  // Centralised onSuccess invalidation: every CRUD mutation refreshes
  // both the list and the per-id detail cache for this resource. Pages
  // no longer need to remember to call queryClient.invalidateQueries —
  // forgetting was a real source of stale-cache bugs.
  const invalidateAll = (qc: ReturnType<typeof useQueryClient>) => {
    void qc.invalidateQueries({ queryKey: [key] });
  };

  const useCreateMutation = <TData, TBody>() => {
    const queryClient = useQueryClient();
    return useMutation<TData, AxiosError<LaravelErrorResponse>, TBody>({
      mutationFn: (data) => api.create(data) as Promise<TData>,
      onSuccess: () => invalidateAll(queryClient),
    });
  };

  const useUpdateMutation = <TData, TBody>() => {
    const queryClient = useQueryClient();
    return useMutation<TData, AxiosError<LaravelErrorResponse>, { id: number | string; data: TBody }>({
      mutationFn: ({ id, data }) => api.update({ id, data }) as Promise<TData>,
      onSuccess: () => invalidateAll(queryClient),
    });
  };

  const useDeleteMutation = <TResp>() => {
    const queryClient = useQueryClient();
    return useMutation<TResp, AxiosError<LaravelErrorResponse>, number | string>({
      mutationFn: (id) => api.delete(id) as Promise<TResp>,
      onSuccess: () => invalidateAll(queryClient),
    });
  };

  return { useGetAllQuery, useGetByIdQuery, useCreateMutation, useUpdateMutation, useDeleteMutation };
}
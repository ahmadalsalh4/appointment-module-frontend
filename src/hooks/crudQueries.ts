import { useMutation, useQuery } from "@tanstack/react-query";
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
    });

  const useGetByIdQuery = <T>(id: number | string) =>
    useQuery<T, AxiosError<LaravelErrorResponse>>({
      queryKey: [key, id],
      queryFn: () => api.getById(id) as Promise<T>,
      enabled: !!id,
    });

  const useCreateMutation = <TData, TBody>() =>
    useMutation<TData, AxiosError<LaravelErrorResponse>, TBody>({
      mutationFn: (data) => api.create(data) as Promise<TData>,
    });

  const useUpdateMutation = <TData, TBody>() =>
    useMutation<TData, AxiosError<LaravelErrorResponse>, { id: number | string; data: TBody }>({
      mutationFn: ({ id, data }) => api.update({ id, data }) as Promise<TData>,
    });

  const useDeleteMutation = <TResp>() =>
    useMutation<TResp, AxiosError<LaravelErrorResponse>, number | string>({
      mutationFn: (id) => api.delete(id) as Promise<TResp>,
    });

  return { useGetAllQuery, useGetByIdQuery, useCreateMutation, useUpdateMutation, useDeleteMutation };
}

import { useMutation, useQuery } from "@tanstack/react-query";
import categoriesApi from "../api/categories";
import type { AxiosError } from "axios";
import type {
  Category,
  CategoryWithServices,
  DeleteCategoryResponse,
  CategoryRequestBody,
  LaravelErrorResponse,
} from "../other/types";

export const useGetAllCategoriesQuery = () => {
  return useQuery<Category[], AxiosError<LaravelErrorResponse>>({
    queryKey: ["categories"],
    queryFn: async () => {
      return await categoriesApi.getAll();
    },
  });
};

export const useGetCategoryByIdQuery = (id: number | string) => {
  return useQuery<CategoryWithServices, AxiosError<LaravelErrorResponse>>({
    queryKey: ["categories", id],
    queryFn: async () => {
      return await categoriesApi.getById(id);
    },
    enabled: !!id, // Only fetch if ID exists
  });
};

export const useCreateCategoryMutation = () => {
  return useMutation<
    Category,
    AxiosError<LaravelErrorResponse>,
    CategoryRequestBody
  >({
    mutationFn: async (data) => {
      return await categoriesApi.create(data);
    },
  });
};

export const useUpdateCategoryMutation = () => {
  return useMutation<
    Category,
    AxiosError<LaravelErrorResponse>,
    { id: number | string; data: CategoryRequestBody }
  >({
    mutationFn: async ({ id, data }) => {
      return await categoriesApi.update({ id, data });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  return useMutation<
    DeleteCategoryResponse,
    AxiosError<LaravelErrorResponse>,
    number | string
  >({
    mutationFn: async (id) => {
      return await categoriesApi.delete(id);
    },
  });
};

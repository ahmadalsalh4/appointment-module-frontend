import { useQuery } from "@tanstack/react-query";
import categoriesApi from "../api/categories";
import { createCrudHooks } from "./crudQueries";
import type { AxiosError } from "axios";
import type {
  Category,
  CategoryWithServices,
  CategoryRequestBody,
  DeleteCategoryResponse,
  LaravelErrorResponse,
  StaffEntity,
} from "../other/types";

const {
  useGetAllQuery: _useGetAll,
  useGetByIdQuery: _useGetById,
  useCreateMutation: _useCreate,
  useUpdateMutation: _useUpdate,
  useDeleteMutation: _useDelete,
} = createCrudHooks(categoriesApi, "categories");

export const useGetAllCategoriesQuery = (params?: Record<string, unknown>) => _useGetAll<Category>(params);
export const useGetCategoryByIdQuery = (id: number | string) =>
  _useGetById<CategoryWithServices>(id);
export const useCreateCategoryMutation = () =>
  _useCreate<Category, CategoryRequestBody>();
export const useUpdateCategoryMutation = () =>
  _useUpdate<Category, CategoryRequestBody>();
export const useDeleteCategoryMutation = () =>
  _useDelete<DeleteCategoryResponse>();

export const useGetCategoryStaffQuery = (categoryId: string | number) =>
  useQuery<StaffEntity[], AxiosError<LaravelErrorResponse>>({
    queryKey: ["categories", categoryId, "staff"],
    queryFn: () => categoriesApi.getCategoryStaff(categoryId),
    enabled: !!categoryId,
  });

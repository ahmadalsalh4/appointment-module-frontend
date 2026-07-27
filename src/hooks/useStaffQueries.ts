import staffApi from "../api/staff";
import { createCrudHooks } from "./crudQueries";
import type {
  StaffEntity,
  StaffEntityDetailed,
  CreateStaffRequestBody,
  UpdateStaffRequestBody,
  UpdateStaffResponse,
  DeleteStaffResponse,
} from "../other/types";

const {
  useGetAllQuery: _useGetAll,
  useGetByIdQuery: _useGetById,
  useCreateMutation: _useCreate,
  useUpdateMutation: _useUpdate,
  useDeleteMutation: _useDelete,
} = createCrudHooks(staffApi, "staff");

export const useGetAllStaffQuery = () => _useGetAll<StaffEntity>();
export const useGetStaffByIdQuery = (id: number | string) =>
  _useGetById<StaffEntityDetailed>(id);
export const useCreateStaffMutation = () =>
  _useCreate<StaffEntity, CreateStaffRequestBody>();
export const useUpdateStaffMutation = () =>
  _useUpdate<UpdateStaffResponse, UpdateStaffRequestBody>();
export const useDeleteStaffMutation = () =>
  _useDelete<DeleteStaffResponse>();

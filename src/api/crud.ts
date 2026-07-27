import api from "./index";

export function createCrudApi(basePath: string) {
  return {
    getAll: async () => (await api.get(`/${basePath}`)).data,
    getById: async (id: number | string) => (await api.get(`/${basePath}/${id}`)).data,
    create: async (data: unknown) => (await api.post(`/${basePath}`, data)).data,
    update: async ({ id, data }: { id: number | string; data: unknown }) =>
      (await api.put(`/${basePath}/${id}`, data)).data,
    delete: async (id: number | string) => (await api.delete(`/${basePath}/${id}`)).data,
  };
}

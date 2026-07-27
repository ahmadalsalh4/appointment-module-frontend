import api from "./index";
import { createCrudApi } from "./crud";

const crud = createCrudApi("categories");

export default {
  ...crud,
  getCategoryStaff: async (categoryId: number | string) =>
    (await api.get(`/categories/${categoryId}/staff`)).data,
};

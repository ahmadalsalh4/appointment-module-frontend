import api from "./index";
import { createCrudApi } from "./crud";

const crud = createCrudApi("services");

export default {
  ...crud,
  getServiceStaff: async (serviceId: number | string) =>
    (await api.get(`/services/${serviceId}/staff`)).data,
};

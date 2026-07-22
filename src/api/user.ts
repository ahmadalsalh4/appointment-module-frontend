import api from ".";

export default {
  getProfile: async (role: string) => {
    const res = await api.get(`/${role}/profile`);
    return res.data;
  },
};

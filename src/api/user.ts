import api from ".";


export default {
  getProfile: async (role: string) => {
    // Dynamically builds: /api/customer/profile OR /api/staff/profile etc.
    const res = await api.get(`/${role}/profile`);
    return res.data;
  },
};

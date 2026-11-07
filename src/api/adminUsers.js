
import api from "./api";

const BASE = "admin/users/";

export const getAdminUsers = async (params = {}) => {
  const response = await api.get(BASE, { params });
  return response.data;
};

export const getAdminUserStats = async () => {
  const response = await api.get(`${BASE}stats/`);
  return response.data;
};

export const getAdminUserDetail = async (userId) => {
  const response = await api.get(`${BASE}${userId}/`);
  return response.data;
};

export const updateAdminUserStatus = async (
  userId,
  isActive
) => {
  const response = await api.patch(
    `${BASE}${userId}/status/`,
    {
      is_active: isActive,
    }
  );

  return response.data;
};

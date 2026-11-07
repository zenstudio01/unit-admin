
import api from "./api";

const BASE = "admin/properties/";

export const getAdminProperties = async (params = {}) => {
  const response = await api.get(BASE, { params });
  return response.data;
};

export const getAdminPropertyStats = async () => {
  const response = await api.get(`${BASE}stats/`);
  return response.data;
};

export const getAdminPropertyDetail = async (propertyId) => {
  const response = await api.get(`${BASE}${propertyId}/`);
  return response.data;
};

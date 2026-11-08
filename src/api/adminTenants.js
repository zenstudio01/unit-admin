
import api from "./api";

const BASE = "admin/tenants/";

export const getAdminTenants = async (params = {}) => {
  const response = await api.get(BASE, { params });
  return response.data;
};

export const getAdminTenantStats = async () => {
  const response = await api.get(`${BASE}stats/`);
  return response.data;
};

export const getAdminTenantDetail = async (id) => {
  const response = await api.get(`${BASE}${id}/`);
  return response.data;
};

export const getAdminTenantLeases = async (params = {}) => {
  const response = await api.get(`${BASE}leases/`, { params });
  return response.data;
};

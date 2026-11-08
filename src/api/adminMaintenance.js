
import api from "./api";

const BASE = "admin/maintenance/";

export const getAdminMaintenanceTickets = async (
  params = {}
) => {
  const response = await api.get(BASE, { params });
  return response.data;
};

export const getAdminMaintenanceStats = async () => {
  const response = await api.get(`${BASE}stats/`);
  return response.data;
};

export const getAdminMaintenanceDetail = async (id) => {
  const response = await api.get(`${BASE}${id}/`);
  return response.data;
};

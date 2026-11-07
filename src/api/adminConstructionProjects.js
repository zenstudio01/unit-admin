
import api from "./api";

const BASE = "admin/construction-projects/";

export const getAdminConstructionProjects = async (params = {}) => {
  const response = await api.get(BASE, { params });
  return response.data;
};

export const getAdminConstructionProjectStats = async () => {
  const response = await api.get(`${BASE}stats/`);
  return response.data;
};

export const getAdminConstructionProjectDetail = async (projectId) => {
  const response = await api.get(`${BASE}${projectId}/`);
  return response.data;
};

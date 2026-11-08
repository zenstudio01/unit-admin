
import api from "./api";

const BASE = "admin/reports/";

export const getAdminReportsOverview = async (params = {}) => {
  const response = await api.get(`${BASE}overview/`, { params });
  return response.data;
};

export const getAdminReportsRevenue = async (params = {}) => {
  const response = await api.get(`${BASE}revenue/`, { params });
  return response.data;
};

export const getAdminReportsOccupancy = async (params = {}) => {
  const response = await api.get(`${BASE}occupancy/`, { params });
  return response.data;
};

export const getAdminReportsMaintenance = async (params = {}) => {
  const response = await api.get(`${BASE}maintenance/`, { params });
  return response.data;
};

export const getAdminReportsConstruction = async (params = {}) => {
  const response = await api.get(`${BASE}construction/`, { params });
  return response.data;
};

export const getAdminReportsSubscriptions = async (params = {}) => {
  const response = await api.get(`${BASE}subscriptions/`, { params });
  return response.data;
};

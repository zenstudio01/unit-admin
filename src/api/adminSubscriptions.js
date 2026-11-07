
import api from "./api";

const BASE = "admin/subscriptions/";

export const getAdminSubscriptions = async (params = {}) => {
  const response = await api.get(BASE, { params });
  return response.data;
};

export const getAdminSubscriptionStats = async () => {
  const response = await api.get(`${BASE}stats/`);
  return response.data;
};

export const getAdminSubscriptionDetail = async (id) => {
  const response = await api.get(`${BASE}${id}/`);
  return response.data;
};

export const getAdminSubscriptionPackages = async () => {
  const response = await api.get(`${BASE}packages/`);
  return response.data;
};

export const createAdminSubscriptionPackage = async (payload) => {
  const response = await api.post(`${BASE}packages/`, payload);
  return response.data;
};

export const updateAdminSubscriptionPackage = async (id, payload) => {
  const response = await api.patch(
    `${BASE}packages/${id}/`,
    payload
  );
  return response.data;
};

export const getAdminSubscriptionPayments = async (params = {}) => {
  const response = await api.get(`${BASE}payments/`, { params });
  return response.data;
};

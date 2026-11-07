
import api from "./api";

const BASE = "admin/payments/";

export const getAdminPayments = async (params = {}) => {
  const response = await api.get(BASE, { params });
  return response.data;
};

export const getAdminPaymentStats = async () => {
  const response = await api.get(`${BASE}stats/`);
  return response.data;
};

export const getAdminPaymentDetail = async (id) => {
  const response = await api.get(`${BASE}${id}/`);
  return response.data;
};

export const getAdminSubscriptionTransactions = async (
  params = {}
) => {
  const response = await api.get(
    `${BASE}subscriptions/`,
    { params }
  );
  return response.data;
};

export const getAdminPaymentReconciliations = async (
  params = {}
) => {
  const response = await api.get(
    `${BASE}reconciliations/`,
    { params }
  );
  return response.data;
};


import api from "./api";

const BASE = "admin/organizations/";

export const getOrganizations = async (params = {}) => {
  const response = await api.get(BASE, { params });
  return response.data;
};

export const getOrganizationStats = async () => {
  const response = await api.get(`${BASE}stats/`);
  return response.data;
};

export const getOrganizationDetail = async (id) => {
  const response = await api.get(`${BASE}${id}/`);
  return response.data;
};

export const updateOrganizationVerification = async (
  id,
  isVerified
) => {
  const response = await api.patch(
    `${BASE}${id}/verification/`,
    { is_verified: isVerified }
  );
  return response.data;
};

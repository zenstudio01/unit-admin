
import api from "./api";

const BASE = "admin/settings/";

export const getAdminSettings = async () => {
  const response = await api.get(BASE);
  return response.data;
};

export const updateAdminSettings = async (payload) => {
  const response = await api.patch(BASE, payload);
  return response.data;
};

export const getAdminSettingsProfile = async () => {
  const response = await api.get(`${BASE}profile/`);
  return response.data;
};

export const updateAdminSettingsProfile = async (payload) => {
  const response = await api.patch(
    `${BASE}profile/`,
    payload
  );
  return response.data;
};

export const changeAdminPassword = async (payload) => {
  const response = await api.post(
    `${BASE}change-password/`,
    payload
  );
  return response.data;
};


import axios from "axios";

const API_BASE_URL =
  import.meta.env.API_URL ||
  "https://unit-backend-jo1w.onrender.com/api/v1";

// Main Axios instance
const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, "") + "/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate instance for refreshing tokens
const refreshApi = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, "") + "/",
  timeout: 30000,
});

// Token helpers
export const getAccessToken = () =>
  localStorage.getItem("unit_admin_access_token");

export const getRefreshToken = () =>
  localStorage.getItem("unit_admin_refresh_token");

export const setAuthTokens = (access, refresh) => {
  if (access) {
    localStorage.setItem("unit_admin_access_token", access);
  }

  if (refresh) {
    localStorage.setItem("unit_admin_refresh_token", refresh);
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem("unit_admin_access_token");
  localStorage.removeItem("unit_admin_refresh_token");
};

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh-token request shared by concurrent 401 responses
let refreshPromise = null;

const refreshAccessToken = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const response = await refreshApi.post("token/refresh/", {
    refresh,
  });

  const newAccess = response.data.access;
  const newRefresh = response.data.refresh;

  if (!newAccess) {
    throw new Error("Token refresh failed");
  }

  setAuthTokens(newAccess, newRefresh);

  return newAccess;
};

// Automatically retry expired-token requests
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Do not retry authentication endpoints
    if (
      originalRequest.url?.includes("token/refresh/") ||
      originalRequest.url?.includes("login/")
    ) {
      return Promise.reject(error);
    }

    if (!getRefreshToken()) {
      clearAuthTokens();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccess = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccess}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();

      // Let protected routes handle the redirect to login.
      window.dispatchEvent(new Event("unit-admin-session-expired"));

      return Promise.reject(refreshError);
    }
  }
);

export default api;


import api, {
  setAuthTokens,
  clearAuthTokens,
} from "./api";

const ADMIN_USER_KEY = "unit_admin_user";

export const signinAdmin = async (credentials) => {
  const response = await api.post("admin/signin/", credentials);

  const { access, refresh, user } = response.data;

  if (!access || !refresh || !user) {
    throw new Error("Invalid authentication response.");
  }

  if (!user.is_staff && !user.is_superuser) {
    throw new Error("Administrator access required.");
  }

  setAuthTokens(access, refresh);

  localStorage.setItem(
    ADMIN_USER_KEY,
    JSON.stringify(user)
  );

  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get("admin/me/");

  localStorage.setItem(
    ADMIN_USER_KEY,
    JSON.stringify(response.data.user)
  );

  return response.data.user;
};

export const getStoredAdmin = () => {
  try {
    return JSON.parse(
      localStorage.getItem(ADMIN_USER_KEY) || "null"
    );
  } catch {
    return null;
  }
};

export const signoutAdmin = () => {
  clearAuthTokens();
  localStorage.removeItem(ADMIN_USER_KEY);
};

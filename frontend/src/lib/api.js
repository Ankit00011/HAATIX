import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});

export const getAuthConfig = () => {
  const token = localStorage.getItem("accessToken");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

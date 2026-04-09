import axios from "axios";

const defaultBackend = "https://haatix-server.onrender.com";
export const API_BASE_URL = import.meta.env.VITE_URL || (import.meta.env.DEV ? "http://localhost:8000" : defaultBackend);

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

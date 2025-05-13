// src/services/api.ts
import axios from "axios";
import { useAuthStore } from "@/store/auth";

const api = axios.create({
  baseURL: "http://localhost:8090/corte-backend/api/v1",
});

// Interceptor para añadir el token automáticamente a cada request
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

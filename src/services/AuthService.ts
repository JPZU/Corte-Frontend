import axios from "axios";
// services/AuthService.ts
import api from "./api";

export async function getProfile() {
  const response = await api.get("/auth/me");
  return response.data; // contiene nombre, email, rol, etc.
}

export async function login(email: string, password: string): Promise<string> {
  const response = await axios.post(
    "http://localhost:8090/corte-backend/api/v1/auth/login",
    { email, password }
  );

  const token = response.headers["authorization"];

  if (!token) {
    throw new Error("❌ No token received");
  }

  return token;
}

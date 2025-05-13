import api from "./api";
import { useAuthStore } from "@/store/auth";

export async function getAllOps() {
  const authStore = useAuthStore();

  const response = await api.get("/ops/all", {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  console.log("Token usado:", authStore.token);

  return response.data;
}

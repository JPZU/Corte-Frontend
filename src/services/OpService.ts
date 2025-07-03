import api from "./api";
// import { useAuthStore } from "@/store/auth";

// export async function getAllOps() {
//   const authStore = useAuthStore();

//   const response = await api.get("/ops/all", {
//     headers: {
//       Authorization: `Bearer ${authStore.token}`,
//     },
//   });
//   console.log("Token usado:", authStore.token);

//   return response.data;
// }

export async function getAllOps() {
  const response = await api.get("/ops/all");
  return response.data;
}

export async function getOpById(id: number) {
  const response = await api.get(`/ops/id/${id}`);
  return response.data;
}

export async function updateOp(data: any) {
  const response = await api.put("/ops/update", data);
  return response.data;
}

export async function deleteOp(id: number) {
  const response = await api.delete(`/ops/delete/${id}`);
  return response.data;
}

// ----------------------------------

export async function getByCreatedAtBetween(data: any) {
  const response = await api.get("/ops/created-between", data);
  return response.data;
}

export async function getByConsecutiveNumber(number: number) {
  const response = await api.get(`/ops/consecutive/${number}`);
  return response.data;
}

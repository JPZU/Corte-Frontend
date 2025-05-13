import api from "./api";

export async function getAllSuppliers() {
  const response = await api.get("/suppliers/all");
  return response.data;
}

import api from "./api";

export async function getAllCategories() {
  const response = await api.get("/categories/all");
  return response.data;
}

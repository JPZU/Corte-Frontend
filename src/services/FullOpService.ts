import api from "./api";

export async function createFullClothEntry(data: { entry: any; items: any[] }) {
  const response = await api.post("/full-op", data);
  return response.data;
}

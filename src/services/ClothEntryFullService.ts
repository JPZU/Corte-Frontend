// src/services/ClothEntryFullService.ts
import api from "./api";

export async function createFullClothEntry(data: { entry: any; items: any[] }) {
  const response = await api.post("/cloth-entries/full", data);
  return response.data;
}

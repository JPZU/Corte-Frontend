import api from "./api";

export async function getAllClothEntryItems() {
  const response = await api.get("/cloths-entry-item/all");
  return response.data;
}

export async function getClothEntryItemById(id: number) {
  const response = await api.get(`/cloths-entry-item/id/${id}`);
  return response.data;
}

export async function createClothEntryItem(data: any) {
  const response = await api.post("/cloths-entry-item/create", data);
  return response.data;
}

export async function updateClothEntryItem(data: any) {
  const response = await api.put("/cloths-entry-item/update", data);
  return response.data;
}

export async function deleteClothEntryItem(id: number) {
  const response = await api.delete(`/cloths-entry-item/delete/${id}`);
  return response.data;
}

/* --------------------------------------------------------
                    PERSONALIZED QUERYS
--------------------------------------------------------- */
export async function getClothsEntryItemsByCreatedAtBetween(data: any) {
  const response = await api.get("/cloths-entry-item/created-between", data);
  return response.data;
}

/* --------------------------------------------------------
                    RELATIONSHIP METHODS
--------------------------------------------------------- */
export async function getClothsEntryItemByClothEntryId(id: string) {
  const response = await api.get(`/cloths-entry-item/cloth-entry/${id}`);
  return response.data;
}

export async function getClothsEntryItemByClothId(id: string) {
  const response = await api.get(`/cloths-entry-item/cloth/${id}`);
  return response.data;
}

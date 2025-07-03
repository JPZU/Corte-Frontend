import api from "./api";

export async function getAllItemCloths() {
  const response = await api.get("/item-cloths/all");
  return response.data;
}

export async function getItemClothById(id: number) {
  const response = await api.get(`/item-cloths/id/${id}`);
  return response.data;
}

export async function createItemCloth(data: any) {
  const response = await api.post("/item-cloths/create", data);
  return response.data;
}

export async function updateItemCloth(data: any) {
  const response = await api.put("/item-cloths/update", data);
  return response.data;
}

export async function deleteItemCloth(id: number) {
  const response = await api.delete(`/item-cloths/delete/${id}`);
  return response.data;
}

// ---------
export async function getItemClothByClothId(id: string) {
  const response = await api.get(`/item-cloths/cloth/${id}`);
  return response.data;
}

export async function getItemClothByOpId(id: string) {
  const response = await api.get(`/item-cloths/op/${id}`);
  return response.data;
}

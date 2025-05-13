import api from "./api";

export async function getAllCloths() {
  const response = await api.get("/cloths/all");
  return response.data;
}

export async function createCloth(data: any) {
  const response = await api.post("/cloths/create", data);
  return response.data;
}

export async function updateCloth(data: any) {
  const response = await api.put("/cloths/update", data);
  return response.data;
}

export async function deleteCloth(id: number) {
  const response = await api.delete(`/cloths/delete/${id}`);
  return response.data;
}

export async function getClothById(id: number) {
  const response = await api.get(`/cloths/id/${id}`);
  return response.data;
}

export async function getClothByName(name: string) {
  const response = await api.get(`/cloths/name/${name}`);
  return response.data;
}

export async function getIsActive() {
  const response = await api.get("/cloths/is-active/");
  return response.data;
}

export async function getIsNotActive() {
  const response = await api.get("/cloths/is-not-active/");
  return response.data;
}

export async function getClothBySupplier(supplierId: string) {
  const response = await api.get(`/cloths/supplier/${supplierId}`);
  return response.data;
}

export async function getClothByCategory(categoryId: number) {
  const response = await api.get(`/cloths/category/${categoryId}`);
  return response.data;
}

export async function getClothByUser(userId: number) {
  const response = await api.get(`/cloths/user/${userId}`);
  return response.data;
}

export async function getByCreatedAtBetween(data: any) {
  const response = await api.get("/cloths/created-between", data);
  return response.data;
}

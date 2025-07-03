import api from "./api";

export async function getAllReferences() {
  const response = await api.get("/references/all");
  return response.data;
}

export async function getReferenceById(id: string) {
  const response = await api.get(`/cloths/id/${id}`);
  return response.data;
}

export async function createReference(data: any) {
  const response = await api.post("/references/create", data);
  return response.data;
}

export async function updateReference(data: any) {
  const response = await api.put("/references/update", data);
  return response.data;
}

export async function deleteRefernce(id: string) {
  const response = await api.delete(`/references/delete/${id}`);
  return response.data;
}

export async function getByCreatedAtBetween(data: any) {
  const response = await api.get("/references/created-between", data);
  return response.data;
}

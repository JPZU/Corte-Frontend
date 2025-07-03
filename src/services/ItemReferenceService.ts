import api from "./api";

export async function getAllItemReferences() {
  const response = await api.get("/item-references/all");
  return response.data;
}

export async function getItemReferenceById(id: number) {
  const response = await api.get(`/item-references/id/${id}`);
  return response.data;
}

export async function updateItemReference(data: any) {
  const response = await api.put("/item-references/update", data);
  return response.data;
}

export async function deleteItemReference(id: number) {
  const response = await api.delete(`/item-references/delete/${id}`);
  return response.data;
}

// Falta el create

// --------------------------------
export async function getItemReferenceByOpId(id: number) {
  const response = await api.get(`/item-references/op/${id}`);
  return response.data;
}

export async function getItemReferenceByReferenceId(id: string) {
  const response = await api.get(`/item-references/op/${id}`);
  return response.data;
}

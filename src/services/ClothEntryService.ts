import api from "./api";

export async function getAllClothsEntry() {
  const response = await api.get("/cloths-entry/all");
  return response.data;
}

export async function getClothEntryById(id: number) {
  const response = await api.get(`/cloths-entry/id/${id}`);
  return response.data;
}

export async function createClothEntry(data: any) {
  const response = await api.post("/cloths-entry/create", data);
  return response.data;
}

export async function updateClothEntry(data: any) {
  const response = await api.put("/cloths-entry/update", data);
  return response.data;
}

export async function deleteClothEntry(id: number) {
  const response = await api.delete(`/cloths-entry/delete/${id}`);
  return response.data;
}

/* --------------------------------------------------------
                    PERSONALIZED QUERYS
--------------------------------------------------------- */

export async function getClothsEntryBySupplierInvoice(supplierInvoice: string) {
  const response = await api.get(
    `/cloths-entry/supplier-invoice/${supplierInvoice}`
  );
  return response.data;
}

export async function getClothsEntryByCreatedAtBetween(
  startDate: string,
  endDate: string
) {
  const { data } = await api.get("/cloths-entry/created-between", {
    params: { startDate, endDate },
  });
  return data;
}

export async function getAllClothsEntryPaged(page = 0, size = 16) {
  const response = await api.get("/cloths-entry/paged", {
    params: { page, size },
  });
  return response.data;
}

/* --------------------------------------------------------
                    RELATIONSHIP METHODS
--------------------------------------------------------- */
export async function getClothsEntryBySupplierId(id: string) {
  const response = await api.get(`/cloths-entry/supplier/${id}`);
  return response.data;
}

export async function getClothsEntryByUserId(id: number) {
  const response = await api.get(`/cloths-entry/user/${id}`);
  return response.data;
}

import api from "./api";

/* ─────────── CRUD básico ─────────── */

export async function getAllReferences() {
  // Lista completa (sigue siendo útil para filtros locales)
  const { data } = await api.get("/references/all");
  return data; // ReferenceResponseDTO[]
}

export async function getReferenceById(id: string) {
  const { data } = await api.get(`/references/id/${id}`);
  return data; // ReferenceResponseDTO
}

export async function createReference(payload: {
  referenceId: string;
  description?: string;
}) {
  const { data } = await api.post("/references/create", payload);
  return data;
}

export async function updateReference(payload: {
  referenceId: string;
  description?: string;
}) {
  const { data } = await api.put("/references/update", payload);
  return data;
}

export async function deleteReference(id: string) {
  const { data } = await api.delete(`/references/delete/${id}`);
  return data;
}

/* ─────────── paginación server-side ─────────── */

export async function getReferencesPaged(page = 0, size = 16) {
  const { data } = await api.get("/references/paged", {
    params: { page, size },
  });
  /*
    data = {
      data: ReferenceResponseDTO[],
      currentPage: number,
      totalItems: number,
      totalPages: number
    }
  */
  return data;
}

/* ─────────── consulta personalizada ─────────── */

export async function getReferencesCreatedBetween(
  startDate: string,
  endDate: string
) {
  const { data } = await api.get("/references/created-between", {
    params: { startDate, endDate },
  });
  return data;
}

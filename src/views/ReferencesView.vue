<template>
  <div>
    <h2 class="mb-4">Referencias Registradas</h2>

    <!-- ▸ Modal DETALLE -->
    <div
      v-if="showDetailModal"
      class="modal-backdrop d-flex justify-content-center align-items-center"
    >
      <div
        class="modal-content p-4 rounded bg-white shadow"
        style="width: 480px"
      >
        <h5>📄 Detalle de Referencia</h5>

        <p><strong>ID:</strong> {{ selectedRef?.referenceId }}</p>
        <p>
          <strong>Descripción:</strong> {{ selectedRef?.description || "—" }}
        </p>

        <hr />
        <p><strong>Creado:</strong> {{ formatDate(selectedRef?.createdAt) }}</p>
        <p>
          <strong>Actualizado:</strong> {{ formatDate(selectedRef?.updatedAt) }}
        </p>

        <button
          class="btn btn-danger w-100 mt-3"
          @click="showDetailModal = false"
        >
          Cerrar
        </button>
      </div>
    </div>

    <!-- ▸ Modal CREAR / EDITAR -->
    <div
      v-if="showFormModal"
      class="modal-backdrop d-flex justify-content-center align-items-center"
    >
      <div
        class="modal-content p-4 rounded bg-white shadow"
        style="width: 480px"
      >
        <h5>{{ isEditing ? "Editar Referencia" : "Crear Referencia" }}</h5>

        <form @submit.prevent="submitReference">
          <input
            v-model="formRef.referenceId"
            type="text"
            class="form-control mb-2 text-uppercase"
            placeholder="ID Referencia"
            maxlength="50"
            :readonly="isEditing"
            required
          />
          <textarea
            v-model="formRef.description"
            class="form-control mb-2"
            placeholder="Descripción (opcional)"
            maxlength="255"
            rows="3"
          ></textarea>

          <button type="submit" class="btn btn-success w-100">
            {{ isEditing ? "Actualizar" : "Crear" }}
          </button>
        </form>

        <button
          class="btn btn-link text-danger w-100 mt-2"
          @click="showFormModal = false"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- ▸ Botón CREAR -->
    <div class="mb-3" v-if="canCreate">
      <button class="btn btn-success" @click="openCreateModal">
        + Crear Referencia
      </button>
    </div>

    <!-- ▸ Filtros -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">Filtros de Búsqueda</h5>

        <!-- Fila texto -->
        <div class="row g-3">
          <div class="col-md-5">
            <input
              v-model="filters.referenceId"
              type="text"
              class="form-control text-uppercase"
              placeholder="🔤 ID Referencia"
            />
          </div>
          <div class="col-md-5">
            <input
              v-model="filters.description"
              type="text"
              class="form-control"
              placeholder="📝 Descripción"
            />
          </div>
          <div class="col-md-2 d-flex justify-content-end gap-2">
            <button class="btn btn-primary flex-grow-1" @click="applyFilters">
              🔍 Buscar
            </button>
            <button class="btn btn-secondary flex-grow-1" @click="resetFilters">
              ✖ Limpiar
            </button>
          </div>
        </div>

        <!-- Fila fechas (solo fecha) -->
        <div class="row g-3 mt-2">
          <div class="col-md-5">
            <input
              v-model="dateRange.start"
              type="date"
              class="form-control"
              placeholder="Fecha inicio"
            />
          </div>
          <div class="col-md-5">
            <input
              v-model="dateRange.end"
              type="date"
              class="form-control"
              placeholder="Fecha fin"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ▸ Tabla -->
    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead class="table-dark text-center">
          <tr>
            <th>ID Referencia</th>
            <th>Descripción</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="ref in references" :key="ref.referenceId">
            <td class="text-uppercase">{{ ref.referenceId }}</td>
            <td>{{ ref.description || "—" }}</td>
            <td class="text-center">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-info" @click="viewReference(ref)">
                  Ver
                </button>
                <button
                  class="btn btn-warning"
                  v-if="canEdit"
                  @click="openEditModal(ref.referenceId)"
                >
                  Editar
                </button>
                <button
                  class="btn btn-danger"
                  v-if="canDelete"
                  @click="confirmDelete(ref.referenceId)"
                >
                  Borrar
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filtersApplied && references.length === 0">
            <td colspan="3" class="text-center py-4 text-warning fw-bold">
              No se encontraron referencias con los filtros aplicados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ▸ Paginación -->
    <div class="d-flex justify-content-center mt-4">
      <button
        class="btn btn-outline-primary me-2"
        @click="goToPreviousPage"
        :disabled="currentPage === 0"
      >
        ←
      </button>
      <span class="align-self-center"
        >Página {{ currentPage + 1 }} de {{ totalPages }}</span
      >
      <button
        class="btn btn-outline-primary ms-2"
        @click="goToNextPage"
        :disabled="currentPage >= totalPages - 1"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// ─── imports ──────────────────────────────────────────
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/store/auth";
import {
  getReferencesPaged,
  getAllReferences,
  getReferenceById,
  createReference,
  updateReference,
  deleteReference,
  getReferencesCreatedBetween,
} from "@/services/ReferenceService";

// ─── tipos ────────────────────────────────────────────
interface Reference {
  referenceId: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── toasts y auth ────────────────────────────────────
const toast = useToast();
const authStore = useAuthStore();

// ─── permisos ─────────────────────────────────────────
const canCreate = ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(authStore.role);
const canEdit = ["SUPER_ADMIN", "ADMIN"].includes(authStore.role);
const canDelete = ["SUPER_ADMIN"].includes(authStore.role);

// ─── estado paginado ─────────────────────────────────
const references = ref<Reference[]>([]);
const currentPage = ref(0);
const pageSize = ref(16);
const totalPages = ref(1);

// ─── filtros ─────────────────────────────────────────
const filters = ref({ referenceId: "", description: "" });
const dateRange = ref({ start: "", end: "" }); // YYYY-MM-DD
const filtersApplied = ref(false);
const fullList = ref<Reference[]>([]); // cache para filtros locales

// ─── cargar página del servidor ──────────────────────
async function fetchPage(p = 0) {
  try {
    const res = await getReferencesPaged(p, pageSize.value);
    references.value = res.data;
    currentPage.value = res.currentPage;
    totalPages.value = res.totalPages;
  } catch {
    toast.error("Error al cargar las referencias");
  }
}

// ─── paginación botones ──────────────────────────────
function goToNextPage() {
  if (currentPage.value < totalPages.value - 1)
    fetchPage(currentPage.value + 1);
}
function goToPreviousPage() {
  if (currentPage.value > 0) fetchPage(currentPage.value - 1);
}

// ─── paginación local ────────────────────────────────
function localPaginate(list: Reference[]) {
  totalPages.value = Math.max(1, Math.ceil(list.length / pageSize.value));
  const start = currentPage.value * pageSize.value;
  references.value = list.slice(start, start + pageSize.value);
}

// ─── filtros ─────────────────────────────────────────
async function applyFilters() {
  currentPage.value = 0;

  const idF = filters.value.referenceId.trim().toUpperCase();
  const descF = filters.value.description.trim().toLowerCase();
  const hasDates = !!dateRange.value.start && !!dateRange.value.end;

  // 1) FILTRO POR FECHAS
  if (hasDates) {
    // Construir LocalDateTime 00:00:00 y 23:59:59
    const startDate = `${dateRange.value.start}T00:00:00`;
    const endDate = `${dateRange.value.end}T23:59:59`;

    try {
      const list = await getReferencesCreatedBetween(startDate, endDate);

      const filtered = list.filter((r) => {
        const idMatch = idF ? r.referenceId.includes(idF) : true;
        const descMatch = descF
          ? (r.description ?? "").toLowerCase().includes(descF)
          : true;
        return idMatch && descMatch;
      });

      filtersApplied.value = true;
      fullList.value = filtered;
      localPaginate(fullList.value);
      return;
    } catch {
      toast.error("Error filtrando por rango de fechas");
      return;
    }
  }

  // 2) SOLO FILTROS DE TEXTO
  if (!idF && !descF) {
    filtersApplied.value = false;
    fullList.value = [];
    fetchPage(0);
    return;
  }

  try {
    if (fullList.value.length === 0) fullList.value = await getAllReferences();

    const filtered = fullList.value.filter((r) => {
      const idMatch = idF ? r.referenceId.includes(idF) : true;
      const descMatch = descF
        ? (r.description ?? "").toLowerCase().includes(descF)
        : true;
      return idMatch && descMatch;
    });

    filtersApplied.value = true;
    localPaginate(filtered);
  } catch {
    toast.error("Error al aplicar filtros");
  }
}

function resetFilters() {
  filters.value = { referenceId: "", description: "" };
  dateRange.value = { start: "", end: "" };
  filtersApplied.value = false;
  fullList.value = [];
  fetchPage(0);
}

// ─── modales y CRUD (sin cambios) ────────────────────
const showDetailModal = ref(false);
const selectedRef = ref<Reference | null>(null);
function viewReference(r: Reference) {
  selectedRef.value = r;
  showDetailModal.value = true;
}

const showFormModal = ref(false);
const isEditing = ref(false);
const formRef = ref<Reference>({ referenceId: "", description: "" });

function openCreateModal() {
  isEditing.value = false;
  formRef.value = { referenceId: "", description: "" };
  showFormModal.value = true;
}

async function openEditModal(id: string) {
  if (!canEdit) return toast.error("No autorizado");
  try {
    formRef.value = await getReferenceById(id);
    isEditing.value = true;
    showFormModal.value = true;
  } catch {
    toast.error("Error al obtener la referencia");
  }
}

async function submitReference() {
  try {
    const payload = {
      referenceId: formRef.value.referenceId.trim().toUpperCase(),
      description: formRef.value.description?.trim() || "",
    };
    if (!payload.referenceId) return toast.error("ID obligatorio");

    if (isEditing.value) {
      await updateReference(payload);
      toast.success("Referencia actualizada");
    } else {
      await createReference(payload);
      toast.success("Referencia creada");
    }

    showFormModal.value = false;
    filtersApplied.value ? applyFilters() : fetchPage(currentPage.value);
  } catch (e: any) {
    toast.error(e?.response?.data?.message ?? "Error al guardar la referencia");
  }
}

async function confirmDelete(id: string) {
  if (!canDelete) return toast.error("No autorizado");
  if (!window.confirm(`¿Eliminar la referencia ${id}?`)) return;

  try {
    await deleteReference(id);
    toast.success("Referencia eliminada");
    filtersApplied.value ? applyFilters() : fetchPage(currentPage.value);
  } catch {
    toast.error("Error al eliminar la referencia");
  }
}

// ─── utilidades ──────────────────────────────────────
function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── inicio ──────────────────────────────────────────
onMounted(() => fetchPage(0));
</script>

<style scoped>
/* Estilos finos opcionales */
</style>

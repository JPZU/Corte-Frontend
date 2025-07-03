<template>
  <div>
    <h2 class="mb-4">Telas Registradas</h2>
    <div
      v-if="showDetailModal"
      class="modal-backdrop d-flex justify-content-center align-items-center"
    >
      <div
        class="modal-content p-4 rounded bg-white shadow"
        style="width: 500px"
      >
        <h5>📄 Detalle de Tela</h5>
        <p><strong>ID: </strong> {{ selectedCloth.clothId }}</p>
        <p>
          <strong>Nombre: </strong>
          <span class="text-uppercase">
            {{ selectedCloth.name }}
          </span>
        </p>
        <p><strong>Metros:</strong> {{ formatMeters(selectedCloth.meters) }}</p>
        <p>
          <strong
            >Activo:
            <span
              class="text-uppercase"
              :class="selectedCloth.isActive ? 'text-success' : 'text-danger'"
            >
              {{ selectedCloth.isActive ? "Sí" : "No" }}
            </span></strong
          >
        </p>
        <hr />
        <p><strong>Categoría:</strong> {{ selectedCloth.category?.name }}</p>
        <hr />
        <p>
          <strong>Creado:</strong> {{ formatDate(selectedCloth.createdAt) }}
        </p>
        <p>
          <strong>Actualizado:</strong>
          {{ formatDate(selectedCloth.updatedAt) }}
        </p>
        <button
          class="btn btn-danger w-100 mt-3"
          @click="showDetailModal = false"
        >
          Cerrar
        </button>
      </div>
    </div>
    <!-- Modal para Crear/Editar Tela -->
    <div
      v-if="showFormModal"
      class="modal-backdrop d-flex justify-content-center align-items-center"
    >
      <div
        class="modal-content p-4 rounded bg-white shadow"
        style="width: 500px"
      >
        <h5>{{ isEditing ? "Editar Tela" : "Crear Tela" }}</h5>
        <form @submit.prevent="submitCloth">
          <input
            v-model="formCloth.name"
            type="text"
            class="form-control mb-2"
            placeholder="Nombre"
            required
          />
          <div class="d-flex align-items-center mb-2">
            <label class="me-2 mb-0 text-nowrap">Categoría:</label>
            <select
              v-model="formCloth.category.categoryId"
              class="form-select flex-grow-1"
              required
            >
              <option disabled value="">Seleccionar categoría</option>
              <option
                v-for="cat in categories"
                :key="cat.categoryId"
                :value="cat.categoryId"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="formCloth.isActive"
              id="isActive"
            />
            <label class="form-check-label" for="isActive"> Activo </label>
          </div>
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

    <div class="mb-3" v-if="canCreate">
      <button class="btn btn-success" @click="openCreateModal">
        + Crear Tela
      </button>
    </div>

    <!-- ▸ Filtros -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">Filtros de Búsqueda</h5>

        <!-- Fila texto / categoría / estado -->
        <div class="row g-3">
          <div class="col-md-6">
            <input
              v-model="filters.name"
              type="text"
              class="form-control text-uppercase"
              placeholder="🔤 Nombre de la tela"
            />
          </div>
          <div class="col-md-6">
            <select v-model="filters.categoryId" class="form-select">
              <option value="">🗂️ Categoría</option>
              <option
                v-for="cat in categories"
                :key="cat.categoryId"
                :value="cat.categoryId"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <select v-model="filters.status" class="form-select">
              <option value="">📦 Estado</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          <div class="col-md-6 d-flex justify-content-end gap-2">
            <button class="btn btn-primary" @click="applyFilters">
              🔍 Buscar
            </button>
            <button class="btn btn-secondary" @click="resetFilters">
              ✖ Limpiar
            </button>
          </div>
        </div>

        <!-- Fila rango de fechas -->
        <div class="row g-3 mt-2">
          <div class="col-md-6">
            <input
              v-model="dateRange.start"
              type="date"
              class="form-control"
              placeholder="Fecha inicio"
            />
          </div>
          <div class="col-md-6">
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

    <div class="row g-3">
      <div class="col-md-3" v-for="cloth in cloths" :key="cloth.clothId">
        <div
          class="card shadow-sm w-100"
          :class="[
            cloth.isActive ? 'border-success' : 'border-danger',
            'border-5',
          ]"
        >
          <div class="card-body text-center">
            <h5 class="card-title text-uppercase">{{ cloth.name }}</h5>
            <p class="card-text text-capitalize">
              <strong>ID:</strong> {{ cloth.clothId }}<br />
              <strong>Metros:</strong> {{ formatMeters(cloth.meters) }}<br />
            </p>
            <div class="d-flex justify-content-center gap-2">
              <button
                class="btn btn-sm btn-warning"
                @click="openEditModal(cloth.clothId)"
                v-if="canEdit"
              >
                Editar
              </button>
              <button class="btn btn-sm btn-info" @click="viewCloth(cloth)">
                Ver
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="filtersApplied && cloths.length === 0"
        class="col-12 text-center"
      >
        <div class="alert alert-warning mt-3" role="alert">
          No se encontraron telas con los filtros aplicados.
        </div>
      </div>
    </div>

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
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/auth";
import { useToast } from "vue-toastification";
import {
  getClothById,
  createCloth,
  updateCloth,
  getAllClothsPaged,
  filterCloths,
  getClothsCreatedBetween, // ← NUEVO
} from "@/services/ClothService";
import { getAllCategories } from "@/services/CategoryService";
import { getAllSuppliers } from "@/services/SupplierService";

/* ───────────────────────────  estado global  ─────────────────────────── */
const toast = useToast();
const authStore = useAuthStore();

const canCreate = ["SUPER_ADMIN", "ADMIN"].includes(authStore.role);
const canEdit = ["SUPER_ADMIN", "ADMIN"].includes(authStore.role);

/* ───────────────────────────  paginación base  ───────────────────────── */
const currentPage = ref(0);
const pageSize = ref(16);
const totalPages = ref(1);

/* ───────────────────────────  datos y catálogos  ────────────────────── */
const cloths = ref<any[]>([]);
const categories = ref<any[]>([]);
const suppliers = ref<any[]>([]);

async function loadCategoriesAndSuppliers() {
  try {
    categories.value = await getAllCategories();
    suppliers.value = await getAllSuppliers();
  } catch {
    toast.error("Error al cargar categorías o proveedores");
  }
}

/* ───────────────────────────  filtros  ──────────────────────────────── */
const filters = ref({ name: "", categoryId: "", status: "" });
const dateRange = ref({ start: "", end: "" }); // YYYY-MM-DD

const filtersApplied = ref(false);

/* ───────────────────────────  modales  ───────────────────────────────── */
const showDetailModal = ref(false);
const selectedCloth = ref<any>(null);

const showFormModal = ref(false);
const isEditing = ref(false);
const formCloth = ref({
  clothId: 0,
  name: "",
  meters: 0,
  category: { categoryId: null },
  isActive: true,
});

/* ───────────────────────────  CRUD ayudas  ──────────────────────────── */
function viewCloth(c: any) {
  selectedCloth.value = c;
  showDetailModal.value = true;
}

function openCreateModal() {
  isEditing.value = false;
  formCloth.value = {
    clothId: 0,
    name: "",
    meters: 0,
    category: { categoryId: null },
    isActive: true,
  };
  loadCategoriesAndSuppliers();
  showFormModal.value = true;
}

async function openEditModal(id: number) {
  if (!canEdit) return toast.error("No autorizado para editar");
  try {
    const c = await getClothById(id);
    formCloth.value = { ...c, category: { categoryId: c.category.categoryId } };
    isEditing.value = true;
    loadCategoriesAndSuppliers();
    showFormModal.value = true;
  } catch {
    toast.error("Error al obtener la tela");
  }
}

async function submitCloth() {
  try {
    const payload = {
      clothId: formCloth.value.clothId,
      name: formCloth.value.name.trim(),
      meters: formCloth.value.meters,
      isActive: formCloth.value.isActive,
      categoryId: formCloth.value.category.categoryId,
    };

    if (isEditing.value) {
      await updateCloth(payload);
      toast.success("Tela actualizada");
    } else {
      await createCloth(payload);
      toast.success("Tela creada");
    }

    showFormModal.value = false;
    fetchCloths();
  } catch {
    toast.error("Error al guardar la tela");
  }
}

/* ───────────────────────────  carga paginada  ───────────────────────── */
async function fetchCloths(page = currentPage.value) {
  try {
    const res = await getAllClothsPaged(page, pageSize.value);
    cloths.value = res.data;
    totalPages.value = res.totalPages;
    currentPage.value = res.currentPage;
  } catch {
    toast.error("Error al cargar las telas");
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value - 1)
    fetchCloths(currentPage.value + 1);
}
function goToPreviousPage() {
  if (currentPage.value > 0) fetchCloths(currentPage.value - 1);
}

/* ───────────────────────────  filtros completos  ────────────────────── */
async function applyFilters() {
  currentPage.value = 0;
  const hasDates = !!dateRange.value.start && !!dateRange.value.end;

  /* ——— 1) Rango de fechas activo ——— */
  if (hasDates) {
    try {
      const list = await getClothsCreatedBetween(
        `${dateRange.value.start}T00:00:00`,
        `${dateRange.value.end}T23:59:59`
      );

      const filtered = list.filter((c: any) => {
        const nameOk = filters.value.name
          ? c.name
              .toUpperCase()
              .includes(filters.value.name.trim().toUpperCase())
          : true;
        const catOk = filters.value.categoryId
          ? c.category.categoryId === Number(filters.value.categoryId)
          : true;
        const stateOk = filters.value.status
          ? c.isActive === (filters.value.status === "active")
          : true;
        return nameOk && catOk && stateOk;
      });

      cloths.value = filtered;
      totalPages.value = 1;
      filtersApplied.value = true;
      return;
    } catch {
      toast.error("Error filtrando por fecha");
      return;
    }
  }

  /* ——— 2) Sin rango de fechas: usar /filter ——— */
  const params: any = { page: 0, size: pageSize.value };
  if (filters.value.name.trim()) params.name = filters.value.name.trim();
  if (filters.value.categoryId) params.categoryId = filters.value.categoryId;
  if (filters.value.status) params.isActive = filters.value.status === "active";

  filtersApplied.value =
    !!params.name || !!params.categoryId || params.isActive !== undefined;

  if (!filtersApplied.value) return fetchCloths(0);

  try {
    const res = await filterCloths(params);
    cloths.value = res.data;
    totalPages.value = res.totalPages;
  } catch {
    toast.error("Error al aplicar filtros");
  }
}

function resetFilters() {
  filters.value = { name: "", categoryId: "", status: "" };
  dateRange.value = { start: "", end: "" };
  filtersApplied.value = false;
  fetchCloths(0);
}

/* ───────────────────────────  helpers visuales  ─────────────────────── */
function formatDate(str?: string | null) {
  if (!str) return "—";
  return new Date(str).toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function formatMeters(v?: number) {
  return v !== undefined
    ? new Intl.NumberFormat("es-CO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(v)
    : "—";
}

/* ───────────────────────────  inicio  ──────────────────────────────── */
onMounted(async () => {
  await loadCategoriesAndSuppliers();
  fetchCloths();
});
</script>

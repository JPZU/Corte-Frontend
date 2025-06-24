<template>
  <div>
    <h2 class="mb-4">Entradas de Telas</h2>

    <!-- Botón Crear Entrada -->
    <div class="mb-3" v-if="canCreate">
      <button class="btn btn-success" @click="openCreateModal">
        + Nueva Entrada
      </button>
    </div>

    <!-- Filtros -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">Filtros de búsqueda</h5>
        <div class="row g-3">
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              v-model="filters.supplierId"
              placeholder="Id Proveedor"
            />
          </div>
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              v-model="filters.supplierInvoice"
              placeholder="Número de factura"
            />
          </div>
          <div
            class="col-md-4 text-end d-flex justify-content-end align-items-center gap-2"
          >
            <button class="btn btn-primary" @click="applyFilters">
              🔍 Buscar
            </button>
            <button class="btn btn-secondary" @click="resetFilters">
              ✖ Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="table table-bordered align-middle">
        <thead class="table-dark text-center">
          <tr>
            <th>ID</th>
            <th>Factura</th>
            <th>Proveedor</th>
            <th>Usuario</th>
            <th>Notas</th>
            <th>Fecha de creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries" :key="entry.clothEntryId">
            <td>{{ entry.clothEntryId }}</td>
            <td>{{ entry.supplierInvoice }}</td>
            <td>{{ entry.supplier?.name }}</td>
            <td>{{ entry.user?.name }}</td>
            <td>{{ entry.notes }}</td>
            <td>{{ formatDate(entry.createdAt) }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-info" @click="viewDetail(entry)">
                Ver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="d-flex justify-content-center mt-4">
      <button
        class="btn btn-outline-primary me-2"
        @click="previousPage"
        :disabled="currentPage === 0"
      >
        ←
      </button>
      <span class="align-self-center"
        >Página {{ currentPage + 1 }} de {{ totalPages }}</span
      >
      <button
        class="btn btn-outline-primary ms-2"
        @click="nextPage"
        :disabled="currentPage >= totalPages - 1"
      >
        →
      </button>
    </div>

    <!-- Modal Detalle -->
    <div
      v-if="showDetailModal"
      class="modal-backdrop d-flex justify-content-center align-items-center"
    >
      <div
        class="modal-content p-4 rounded bg-white shadow"
        style="width: 500px"
      >
        <h5>Detalle de Entrada</h5>
        <p><strong>ID:</strong> {{ selectedEntry.clothEntryId }}</p>
        <p><strong>Factura:</strong> {{ selectedEntry.supplierInvoice }}</p>
        <p><strong>Proveedor:</strong> {{ selectedEntry.supplier?.name }}</p>
        <p><strong>Usuario:</strong> {{ selectedEntry.user?.name }}</p>
        <p><strong>Notas:</strong> {{ selectedEntry.notes }}</p>
        <p>
          <strong>Creado:</strong> {{ formatDate(selectedEntry.createdAt) }}
        </p>
        <button
          class="btn btn-danger w-100 mt-3"
          @click="showDetailModal = false"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/store/auth";
import {
  getAllClothsEntryPaged,
  getClothsEntryBySupplierId,
  getClothsEntryBySupplierInvoice,
} from "@/services/ClothEntryService";

const toast = useToast();
const authStore = useAuthStore();

const entries = ref<any[]>([]);
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(1);

const filters = ref({
  supplierId: "",
  supplierInvoice: "",
});

const showDetailModal = ref(false);
const selectedEntry = ref<any>(null);

const canCreate = computed(() =>
  ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(authStore.role)
);
const canEdit = computed(() =>
  ["SUPER_ADMIN", "ADMIN"].includes(authStore.role)
);

const fetchEntries = async () => {
  try {
    const res = await getAllClothsEntryPaged(currentPage.value, pageSize.value);
    entries.value = res.data;
    totalPages.value = res.totalPages;
  } catch (error) {
    toast.error("Error al cargar las entradas");
  }
};

const applyFilters = async () => {
  try {
    if (filters.value.supplierId) {
      const result = await getClothsEntryBySupplierId(filters.value.supplierId);
      entries.value = result ? [result] : [];
      return;
    }
    if (filters.value.supplierInvoice) {
      const result = await getClothsEntryBySupplierInvoice(
        filters.value.supplierInvoice
      );
      entries.value = result ? [result] : [];
      return;
    }
    fetchEntries();
  } catch (error) {
    toast.error("Error al aplicar filtros");
  }
};

const resetFilters = () => {
  filters.value = {
    supplierId: "",
    supplierInvoice: "",
  };
  fetchEntries();
};

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchEntries();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    fetchEntries();
  }
};

const viewDetail = (entry: any) => {
  selectedEntry.value = entry;
  showDetailModal.value = true;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const openCreateModal = () => {
  toast.info("Aquí abrirás el formulario para crear la entrada con items");
};

onMounted(() => {
  fetchEntries();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}
</style>

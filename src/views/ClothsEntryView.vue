<template>
  <div>
    <h2 class="mb-4">Entradas de Telas</h2>

    <!-- ▸ Botón CREAR -->
    <div class="mb-3" v-if="canCreate">
      <button class="btn btn-success" @click="openCreateModal">
        + Nueva Entrada
      </button>
    </div>

    <!-- ▸ Filtros -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">Filtros de búsqueda</h5>

        <div class="row g-3">
          <div class="col-md-4">
            <input
              v-model="filters.supplierId"
              type="text"
              class="form-control"
              placeholder="ID Proveedor"
            />
          </div>
          <div class="col-md-4">
            <input
              v-model="filters.supplierInvoice"
              type="text"
              class="form-control"
              placeholder="Número de factura"
            />
          </div>
        </div>

        <!-- Fila rango de fechas -->
        <div class="row g-3 mt-2">
          <div class="col-md-4">
            <input
              v-model="dateRange.start"
              type="date"
              class="form-control"
              placeholder="Fecha inicio"
            />
          </div>
          <div class="col-md-4">
            <input
              v-model="dateRange.end"
              type="date"
              class="form-control"
              placeholder="Fecha fin"
            />
          </div>

          <div class="col-md-4 d-flex justify-content-end gap-2">
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

    <!-- ▸ Tabla -->
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
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="e in entries"
            :key="e.clothEntryId"
            :class="{ 'table-danger': !e.approve }"
          >
            <td>{{ e.clothEntryId }}</td>
            <td>{{ e.supplierInvoice }}</td>
            <td>{{ e.supplier?.name }}</td>
            <td>{{ e.user?.name }}</td>
            <td>{{ e.notes }}</td>
            <td>{{ formatDate(e.createdAt) }}</td>
            <td>
              <span v-if="e.approve">Activa</span>
              <span v-else class="text-danger fw-bold">Anulada</span>
            </td>
            <td class="text-center">
              <div class="btn-group btn-group-sm" role="group">
                <button class="btn btn-info" @click="viewDetail(e)">Ver</button>
                <button
                  v-if="canEdit && e.approve"
                  class="btn btn-danger"
                  @click="invalidateEntry(e)"
                >
                  Anular
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ▸ Paginación -->
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

    <!-- ▸ Modal DETALLE -->
    <div
      v-if="showDetailModal && selectedEntry"
      class="modal-backdrop d-flex justify-content-center align-items-center"
    >
      <div
        class="modal-content p-4 bg-white rounded shadow"
        style="width: 800px"
      >
        <h5>Detalle de Entrada</h5>
        <p><strong>ID:</strong> {{ selectedEntry.clothEntryId }}</p>
        <p><strong>Factura:</strong> {{ selectedEntry.supplierInvoice }}</p>
        <p><strong>Proveedor:</strong> {{ selectedEntry.supplier?.name }}</p>
        <p><strong>Usuario:</strong> {{ selectedEntry.user?.name }}</p>
        <p><strong>Notas:</strong> {{ selectedEntry.notes }}</p>
        <p><strong>Fecha:</strong> {{ formatDate(selectedEntry.createdAt) }}</p>

        <h6>Ítems</h6>
        <table class="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Código Tela</th>
              <th>Nombre</th>
              <th>Color</th>
              <th>Metros</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="it in selectedItems" :key="it.itemClothEntryId">
              <td>{{ it.cloth?.clothId }}</td>
              <td>{{ it.cloth?.name || "Desconocido" }}</td>
              <td>{{ it.color }}</td>
              <td>{{ it.metersAdded }}</td>
              <td>{{ it.price }}</td>
            </tr>
          </tbody>
        </table>

        <div class="text-end">
          <button class="btn btn-secondary" @click="showDetailModal = false">
            Cerrar
          </button>
        </div>
      </div>
    </div>
    <!-- Modal Crear Entrada con Ítems -->
    <div
      v-if="showCreateModal"
      class="modal-backdrop d-flex justify-content-center align-items-center"
    >
      <div
        class="modal-content p-4 rounded bg-white shadow"
        style="width: 800px"
      >
        <h5>Crear Entrada con Ítems</h5>

        <form @submit.prevent="submitFullEntry">
          <div class="mb-2">
            <input
              v-model="formEntry.supplierInvoice"
              type="text"
              class="form-control"
              placeholder="Factura proveedor"
              required
            />
          </div>
          <div class="mb-2">
            <input
              v-model="formEntry.notes"
              type="text"
              class="form-control"
              placeholder="Notas"
            />
          </div>
          <div class="mb-3">
            <div class="d-flex align-items-center mb-2">
              <label class="me-2 mb-0 text-nowrap">Proveedor:</label>
              <select
                v-model.number="formEntry.supplierId"
                class="form-select"
                required
              >
                <option value="" disabled>Seleccione un proveedor</option>
                <option
                  v-for="s in suppliers"
                  :key="s.supplierId"
                  :value="s.supplierId"
                >
                  {{ s.name }} (ID: {{ s.supplierId }})
                </option>
              </select>
            </div>
          </div>

          <h6>Ítems</h6>
          <div
            v-for="(item, index) in formItems"
            :key="index"
            class="border rounded p-2 mb-2"
          >
            <div class="row g-2">
              <div class="col-md-3">
                <input
                  v-model.number="item.clothId"
                  @input="loadClothName(item)"
                  type="number"
                  class="form-control"
                  placeholder="Código tela"
                  required
                />
              </div>
              <div class="col-md-3">
                <input
                  :value="item.name || 'Código incorrecto'"
                  type="text"
                  class="form-control"
                  placeholder="Nombre"
                  disabled
                />
              </div>
              <div class="col-md-2">
                <input
                  v-model="item.color"
                  type="text"
                  class="form-control"
                  placeholder="Color"
                  required
                />
              </div>
              <div class="col-md-2">
                <input
                  v-model.number="item.meters"
                  type="number"
                  class="form-control"
                  placeholder="Metros"
                  min="0.1"
                  step="0.01"
                  required
                />
                <small class="text-muted">Metros</small>
              </div>
              <div class="col-md-2">
                <input
                  v-model.number="item.price"
                  type="number"
                  class="form-control"
                  placeholder="Precio"
                  min="1"
                  required
                />
                <small class="text-muted">Precio por metro</small>
              </div>
              <div class="col-md-1">
                <button
                  class="btn btn-danger w-100"
                  @click.prevent="removeItem(index)"
                >
                  X
                </button>
              </div>
            </div>
          </div>

          <button
            class="btn btn-outline-secondary mb-3 w-100"
            @click.prevent="addItem"
          >
            + Agregar Ítem
          </button>

          <!-- Por este: -->
          <button type="submit" class="btn btn-success w-100">
            Crear Entrada
          </button>

          <button
            class="btn btn-link text-danger w-100 mt-2"
            @click="showCreateModal = false"
          >
            Cancelar
          </button>
        </form>
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
  updateClothEntry,
  getClothsEntryByCreatedAtBetween,
} from "@/services/ClothEntryService";
import { createFullClothEntry } from "@/services/ClothEntryFullService";
import { getClothsEntryItemByClothEntryId } from "@/services/ClothEntryItemService";

import { getAllSuppliers } from "@/services/SupplierService";
import { getClothById } from "@/services/ClothService";

/* ──────────── estado base ──────────── */
const toast = useToast();
const authStore = useAuthStore();

const entries = ref<any[]>([]);
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(1);

const suppliers = ref<any[]>([]);
const filters = ref({ supplierId: "", supplierInvoice: "" });
const dateRange = ref({ start: "", end: "" });

/* ──────────── permisos ──────────── */
const canCreate = computed(() =>
  ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(authStore.role)
);
const canEdit = computed(() =>
  ["SUPER_ADMIN", "ADMIN"].includes(authStore.role)
);

/* ──────────── tablas y paginación ──────────── */
async function fetchEntries() {
  try {
    const res = await getAllClothsEntryPaged(currentPage.value, pageSize.value);
    entries.value = res.data;
    totalPages.value = res.totalPages;
  } catch {
    toast.error("Error al cargar las entradas");
  }
}
function previousPage() {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchEntries();
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    fetchEntries();
  }
}

/* ──────────── proveedores ──────────── */
async function fetchSuppliers() {
  try {
    suppliers.value = await getAllSuppliers();
  } catch {
    toast.error("Error cargando proveedores");
  }
}

/* ──────────── filtros ──────────── */
async function applyFilters() {
  currentPage.value = 0;

  const hasDates = !!dateRange.value.start && !!dateRange.value.end;
  if (hasDates) {
    try {
      const list = await getClothsEntryByCreatedAtBetween(
        `${dateRange.value.start}T00:00:00`,
        `${dateRange.value.end}T23:59:59`
      );

      const sup = filters.value.supplierId.trim();
      const inv = filters.value.supplierInvoice.trim().toUpperCase();

      entries.value = list.filter((e: any) => {
        const okSup = sup ? e.supplier?.supplierId?.toString() === sup : true;
        const okInv = inv
          ? e.supplierInvoice.toUpperCase().includes(inv)
          : true;
        return okSup && okInv;
      });

      totalPages.value = 1;
      return;
    } catch {
      toast.error("Error filtrando por fechas");
    }
  }

  if (filters.value.supplierId) {
    try {
      const res = await getClothsEntryBySupplierId(filters.value.supplierId);
      entries.value = res ? [res] : [];
      totalPages.value = 1;
    } catch {
      toast.error("Error al filtrar por proveedor");
    }
    return;
  }

  if (filters.value.supplierInvoice) {
    try {
      const res = await getClothsEntryBySupplierInvoice(
        filters.value.supplierInvoice
      );
      entries.value = res ? [res] : [];
      totalPages.value = 1;
    } catch {
      toast.error("Error al filtrar por factura");
    }
    return;
  }

  fetchEntries();
}

function resetFilters() {
  filters.value = { supplierId: "", supplierInvoice: "" };
  dateRange.value = { start: "", end: "" };
  fetchEntries();
}

/* ──────────── DETALLE ──────────── */
const showDetailModal = ref(false);
const selectedEntry = ref<any>(null);
const selectedItems = ref<any[]>([]);

async function viewDetail(entry: any) {
  try {
    selectedEntry.value = entry;
    selectedItems.value = await getClothsEntryItemByClothEntryId(
      entry.clothEntryId
    );
    showDetailModal.value = true;
  } catch {
    toast.error("No se pudo cargar el detalle");
  }
}

/* ──────────── ANULAR ──────────── */
async function invalidateEntry(entry: any) {
  if (!window.confirm(`¿Anular entrada ${entry.clothEntryId}?`)) return;
  try {
    await updateClothEntry({
      ...entry,
      approve: false,
      userId: authStore.userId,
      supplierId: entry.supplier?.supplierId,
    });
    toast.success("Entrada anulada");
    fetchEntries();
  } catch {
    toast.error("Error al anular entrada");
  }
}

/* ──────────── CREAR Entrada completa ──────────── */
const showCreateModal = ref(false);
const formEntry = ref({ supplierInvoice: "", notes: "", supplierId: null });
const formItems = ref<any[]>([]);

function openCreateModal() {
  formEntry.value = { supplierInvoice: "", notes: "", supplierId: null };
  formItems.value = [{ clothId: "", name: "", color: "", meters: 0, price: 0 }];
  showCreateModal.value = true;
}

function addItem() {
  formItems.value.push({
    clothId: "",
    name: "",
    color: "",
    meters: 0,
    price: 0,
  });
}
function removeItem(i: number) {
  formItems.value.splice(i, 1);
}

async function loadClothName(item: any) {
  if (!item.clothId) {
    item.name = "";
    return;
  }
  try {
    const c = await getClothById(item.clothId);
    item.name = c.name;
  } catch {
    item.name = "";
  }
}

async function submitFullEntry() {
  try {
    const payload = {
      entry: {
        ...formEntry.value,
        userId: authStore.userId,
        approve: true,
      },
      items: formItems.value.map((it: any) => ({
        clothEntryId: 0,
        clothId: Number(it.clothId),
        color: it.color,
        metersAdded: it.meters,
        price: it.price,
      })),
    };
    await createFullClothEntry(payload);
    toast.success("Entrada creada");
    showCreateModal.value = false;
    fetchEntries();
  } catch (e: any) {
    toast.error(e?.response?.data?.message || "Error al guardar entrada");
  }
}

/* ──────────── utilidades ──────────── */
function formatDate(str: string) {
  return new Date(str).toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ──────────── inicio ──────────── */
onMounted(() => {
  fetchEntries();
  fetchSuppliers();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}
</style>

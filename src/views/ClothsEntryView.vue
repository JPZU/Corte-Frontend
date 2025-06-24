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

    <!-- Modal Detalle Entrada -->
    <div
      v-if="showDetailModal && selectedEntry"
      class="modal-backdrop d-flex justify-content-center align-items-center"
    >
      <div
        class="modal-content p-4 rounded bg-white shadow"
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
            <tr v-for="item in selectedItems" :key="item.itemClothEntryId">
              <td>{{ item.cloth?.clothId }}</td>
              <td>{{ item.cloth?.name || "Desconocido" }}</td>
              <td>{{ item.color }}</td>
              <td>{{ item.metersAdded }}</td>
              <td>{{ item.price }}</td>
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
                  class="form-control text-danger"
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
                  ✖
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
} from "@/services/ClothEntryService";
import { createFullClothEntry } from "@/services/ClothEntryFullService";
import { getAllSuppliers } from "@/services/SupplierService";
import { getClothById } from "@/services/ClothService";
import { getClothsEntryItemByClothEntryId } from "@/services/ClothEntryItemService";

const toast = useToast();
const authStore = useAuthStore();

const entries = ref<any[]>([]);
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(1);
const suppliers = ref<any[]>([]);

const filters = ref({ supplierId: "", supplierInvoice: "" });

const showDetailModal = ref(false);
const selectedEntry = ref<any>(null);
const selectedItems = ref<any[]>([]);

const showCreateModal = ref(false);
const formEntry = ref({ supplierInvoice: "", notes: "", supplierId: null });
const formItems = ref<any[]>([]);

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

const fetchSuppliers = async () => {
  try {
    suppliers.value = await getAllSuppliers();
  } catch (error) {
    toast.error("Error cargando proveedores");
  }
};

const loadClothName = async (item: any) => {
  if (!item.clothId) {
    item.name = "";
    return;
  }
  try {
    const cloth = await getClothById(item.clothId);
    item.name = cloth.name;
  } catch (e) {
    item.name = "";
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
  filters.value = { supplierId: "", supplierInvoice: "" };
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

const viewDetail = async (entry: any) => {
  try {
    selectedEntry.value = entry;
    selectedItems.value = await getClothsEntryItemByClothEntryId(
      entry.clothEntryId
    );
    showDetailModal.value = true;
  } catch (e) {
    toast.error("No se pudo cargar el detalle de los ítems");
  }
};

const openCreateModal = () => {
  formEntry.value = { supplierInvoice: "", notes: "", supplierId: null };
  formItems.value = [{ clothId: "", name: "", color: "", meters: 0, price: 0 }];
  showCreateModal.value = true;
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

const addItem = () => {
  formItems.value.push({
    clothId: "",
    name: "",
    color: "",
    meters: 0,
    price: 0,
  });
};

const removeItem = (index: number) => {
  formItems.value.splice(index, 1);
};

const submitFullEntry = async () => {
  try {
    const payload = {
      entry: {
        ...formEntry.value,
        userId: authStore.userId,
      },
      items: formItems.value.map((item) => ({
        clothEntryId: 0,
        clothId: Number(item.clothId),
        color: item.color,
        metersAdded: item.meters,
        price: item.price,
      })),
    };
    await createFullClothEntry(payload);
    toast.success("Entrada creada exitosamente");
    showCreateModal.value = false;
    fetchEntries();
  } catch (e) {
    toast.error("Error al crear la entrada");
  }
};

onMounted(() => {
  fetchEntries();
  fetchSuppliers();
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

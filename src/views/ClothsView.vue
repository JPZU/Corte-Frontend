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
        <p class="text-capitalize">
          <strong>Color: </strong> {{ selectedCloth.color }}
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
        <p>
          <strong>Usuario: </strong>
          <span class="text-uppercase">
            {{ selectedCloth.user?.name }}
          </span>
        </p>
        <p class="text-capitalize">
          <strong>Proveedor:</strong> {{ selectedCloth.supplier?.name }}
        </p>
        <p class="text-capitalize">
          <strong>Factura proveedor: </strong>
          <span class="text-uppercase">
            {{ selectedCloth.supplierInvoice }}
          </span>
        </p>
        <p class="text-capitalize">
          <strong>Precio por metro:</strong>
          {{ formatPrice(selectedCloth.price) }}
        </p>

        <p><strong>Categoría:</strong> {{ selectedCloth.category?.name }}</p>
        <p>
          <strong>Notas adicionales:</strong>
          {{ selectedCloth.notes }}
        </p>
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
          <input
            v-model="formCloth.color"
            type="text"
            class="form-control mb-2"
            placeholder="Color"
            required
          />
          <input
            v-model.number="formCloth.meters"
            type="number"
            class="form-control mb-2"
            placeholder="Metros"
            required
            min="0"
            step="0.01"
          />
          <input
            v-model.number="formCloth.price"
            type="number"
            class="form-control mb-2"
            placeholder="Precio por metro"
            required
            min="1000"
          />
          <select
            v-model="formCloth.category.categoryId"
            class="form-select mb-2"
            required
          >
            <option value="" disabled>Seleccionar categoría</option>
            <option
              v-for="cat in categories"
              :key="cat.categoryId"
              :value="cat.categoryId"
            >
              {{ cat.name }}
            </option>
          </select>

          <select
            v-model="formCloth.supplier.supplierId"
            class="form-select mb-3"
            required
          >
            <option value="" disabled>Seleccionar proveedor</option>
            <option
              v-for="sup in suppliers"
              :key="sup.supplierId"
              :value="sup.supplierId"
            >
              {{ sup.name }}
            </option>
          </select>
          <input
            v-model="formCloth.supplierInvoice"
            type="text"
            class="form-control mb-2"
            placeholder="Número factura proveedor"
          />
          <textarea
            v-model="formCloth.notes"
            type="text"
            class="form-control mb-2"
            placeholder="Notas"
          />
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
      <button class="btn btn-primary" @click="openCreateModal">
        Crear Tela
      </button>
    </div>
    <div class="row g-2 mb-4">
      <div class="col-md-3">
        <input
          type="text"
          class="form-control"
          v-model="filters.name"
          placeholder="Filtrar por nombre"
        />
      </div>

      <div class="col-md-3">
        <select v-model="filters.categoryId" class="form-select">
          <option value="">-- Filtrar por categorías --</option>
          <option
            v-for="cat in categories"
            :key="cat.categoryId"
            :value="cat.categoryId"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="col-md-3">
        <select v-model="filters.supplierId" class="form-select">
          <option value="">-- Filtrar por proveedores --</option>
          <option
            v-for="sup in suppliers"
            :key="sup.supplierId"
            :value="sup.supplierId"
          >
            {{ sup.name }}
          </option>
        </select>
      </div>

      <div class="col-md-2">
        <select v-model="filters.status" class="form-select">
          <option value="">-- Filtrar por estado --</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      <div class="col-md-1 d-flex gap-1">
        <button class="btn btn-primary w-100" @click="applyFilters">
          Buscar
        </button>
        <button class="btn btn-secondary w-100" @click="resetFilters">✖</button>
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
              <strong>Color:</strong> {{ cloth.color }}<br />
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
  getClothByName,
  getClothBySupplier,
  getClothByCategory,
  getIsActive,
  getIsNotActive,
  getAllCloths,
  getClothById, // ✅ ESTA LÍNEA
  createCloth,
  updateCloth,
  getBySupplierInvoice,
  getAllClothsPaged,
  filterCloths,
} from "@/services/ClothService";
import { getAllCategories } from "@/services/CategoryService";
import { getAllSuppliers } from "@/services/SupplierService";

const currentPage = ref(0);
const pageSize = ref(16); // puedes ajustar este valor
const totalPages = ref(1);

const categories = ref<any[]>([]);
const suppliers = ref<any[]>([]);

const loadCategoriesAndSuppliers = async () => {
  try {
    categories.value = await getAllCategories();
    suppliers.value = await getAllSuppliers();
  } catch (e) {
    toast.error("Error al cargar categorías o proveedores");
  }
};

const filters = ref({
  name: "",
  categoryId: "",
  supplierId: "",
  status: "", // "active", "inactive"
});

const showDetailModal = ref(false);
const selectedCloth = ref<any>(null);

const toast = useToast();
const authStore = useAuthStore();

const cloths = ref<any[]>([]);

const canCreate = ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(authStore.role);
const canEdit = ["SUPER_ADMIN", "ADMIN"].includes(authStore.role);

const showFormModal = ref(false);
const isEditing = ref(false);

const formCloth = ref({
  clothId: 0,
  name: "",
  color: "",
  meters: null,
  notes: "",
  price: null,
  supplierInvoice: "",
  category: {
    categoryId: null,
  },
  supplier: {
    supplierId: "",
  },
  isActive: true,
});

const fetchCloths = async () => {
  try {
    const res = await getAllClothsPaged(currentPage.value, pageSize.value);
    cloths.value = res.data;
    totalPages.value = res.totalPages;
  } catch (e) {
    toast.error("Error al cargar las telas");
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    fetchCloths();
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchCloths();
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  formCloth.value = {
    clothId: 0,
    name: "",
    color: "",
    meters: null,
    notes: "",
    price: null,
    supplierInvoice: "",
    category: { categoryId: "" },
    supplier: { supplierId: "" },
    isActive: true,
  };
  loadCategoriesAndSuppliers();
  showFormModal.value = true;
};

const openEditModal = async (id: number) => {
  if (!canEdit) return toast.error("No autorizado para editar");
  try {
    const cloth = await getClothById(id);
    formCloth.value = { ...cloth };
    isEditing.value = true;
    await loadCategoriesAndSuppliers();
    showFormModal.value = true;
  } catch (e) {
    toast.error("Error al obtener la tela");
  }
};

const viewCloth = (cloth: any) => {
  selectedCloth.value = cloth;
  showDetailModal.value = true;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const submitCloth = async () => {
  try {
    const payload = {
      clothId: formCloth.value.clothId,
      name: formCloth.value.name,
      color: formCloth.value.color,
      meters: formCloth.value.meters,
      isActive: formCloth.value.isActive,
      notes: formCloth.value.notes,
      price: formCloth.value.price,
      supplierInvoice: formCloth.value.supplierInvoice,
      userId: authStore.userId, // ✅ desde el store (o donde tengas guardado el usuario logueado)
      categoryId: formCloth.value.category.categoryId,
      supplierId: formCloth.value.supplier.supplierId,
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
  } catch (e) {
    toast.error("Error al guardar la tela");
  }
};

const applyFilters = async () => {
  try {
    currentPage.value = 0; // ✅ Reiniciar a página 0

    const params: any = {
      page: currentPage.value,
      size: pageSize.value,
    };

    if (filters.value.name) {
      params.name = filters.value.name.trim();
    }

    if (filters.value.status) {
      params.isActive = filters.value.status === "active";
    }

    if (filters.value.categoryId) {
      params.categoryId = filters.value.categoryId;
    }

    if (filters.value.supplierId) {
      params.supplierId = filters.value.supplierId;
    }

    const res = await filterCloths(params);
    cloths.value = res.data;
    totalPages.value = res.totalPages;
  } catch (e) {
    toast.error("Error al aplicar filtros");
  }
};

const resetFilters = () => {
  filters.value = {
    name: "",
    categoryId: "",
    supplierId: "",
    status: "",
  };
  fetchCloths();
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0, // si no quieres decimales
  }).format(value);
};

const formatMeters = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

onMounted(() => {
  fetchCloths();
  loadCategoriesAndSuppliers(); // ✅ ESTA LÍNEA ES CLAVE
});
</script>

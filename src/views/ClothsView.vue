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
        <p><strong>ID:</strong> {{ selectedCloth.clothId }}</p>
        <p><strong>Nombre:</strong> {{ selectedCloth.name }}</p>
        <p><strong>Color:</strong> {{ selectedCloth.color }}</p>
        <p><strong>Metros:</strong> {{ selectedCloth.meters }}</p>
        <p>
          <strong>Activo: </strong>
          <span
            :class="selectedCloth.isActive ? 'text-success' : 'text-danger'"
          >
            {{ selectedCloth.isActive ? "Sí" : "No" }}
          </span>
        </p>
        <hr />
        <p><strong>Usuario:</strong> {{ selectedCloth.user?.name }}</p>
        <p><strong>Proveedor:</strong> {{ selectedCloth.supplier?.name }}</p>
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
          placeholder="Buscar por nombre"
        />
      </div>

      <div class="col-md-3">
        <select v-model="filters.categoryId" class="form-select">
          <option value="">Todas las categorías</option>
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
          <option value="">Todos los proveedores</option>
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
          <option value="">Todos</option>
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
      <div class="col-md-4" v-for="cloth in cloths" :key="cloth.clothId">
        <div
          class="card shadow-sm"
          :class="[
            cloth.isActive ? 'border-success' : 'border-danger',
            'border-5',
          ]"
        >
          <div class="card-body text-center">
            <h5 class="card-title">{{ cloth.name }}</h5>
            <p class="card-text">
              <strong>ID:</strong> {{ cloth.clothId }}<br />
              <strong>Color:</strong> {{ cloth.color }}<br />
              <strong>Metros:</strong> {{ cloth.meters }}<br />
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
} from "@/services/ClothService";
import { getAllCategories } from "@/services/CategoryService";
import { getAllSuppliers } from "@/services/SupplierService";

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
    cloths.value = await getAllCloths();
  } catch (e) {
    toast.error("Error al cargar las telas");
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  formCloth.value = {
    clothId: 0,
    name: "",
    color: "",
    meters: null,
    category: { categoryId: "" },
    supplier: { supplierId: "" },
    isActive: true,
  };
  loadCategoriesAndSuppliers();
  showFormModal.value = 1;
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
    if (filters.value.name) {
      cloths.value = [await getClothByName(filters.value.name)];
      return;
    }

    if (filters.value.categoryId) {
      cloths.value = await getClothByCategory(Number(filters.value.categoryId));
      return;
    }

    if (filters.value.supplierId) {
      cloths.value = await getClothBySupplier(filters.value.supplierId);
      return;
    }

    if (filters.value.status === "active") {
      cloths.value = await getIsActive();
      return;
    }

    if (filters.value.status === "inactive") {
      cloths.value = await getIsNotActive();
      return;
    }

    // Si no hay filtros aplicados
    fetchCloths();
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

onMounted(() => {
  fetchCloths();
  loadCategoriesAndSuppliers(); // ✅ ESTA LÍNEA ES CLAVE
});
</script>

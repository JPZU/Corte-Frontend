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
        <p>
          <strong>Factura proveedor:</strong>
          {{ selectedCloth.supplierInvoice }}
        </p>
        <p>
          <strong>Precio por metro:</strong>
          {{ selectedCloth.price }}
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
            min="0"
          />
          <input
            v-model="formCloth.supplierInvoice"
            type="text"
            class="form-control mb-2"
            placeholder="# factura proveedor"
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
          placeholder="Buscar por nombre o ID"
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
  getClothById, // ✅ ESTA LÍNEA
  createCloth,
  updateCloth,
  getBySupplierInvoice,
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
    const data = await getAllCloths();
    cloths.value = data.sort((a, b) => {
      // Primero las activas (true > false)
      return (b.isActive === true ? 1 : 0) - (a.isActive === true ? 1 : 0);
    });
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
    let result: any[] = [];

    const hasOtherFilters =
      filters.value.categoryId ||
      filters.value.supplierId ||
      filters.value.status;

    if (filters.value.name) {
      const search = filters.value.name.trim().toLowerCase();

      // 1. Intentar por ID (número exacto)
      if (!isNaN(Number(search))) {
        try {
          const clothById = await getClothById(Number(search));
          result = clothById ? [clothById] : [];
        } catch (e) {
          result = [];
        }
      }

      // 2. Intentar por nombre
      try {
        const clothByName = await getClothByName(search);
        if (clothByName) {
          result.push(clothByName); // evitar duplicados después si quieres
        }
      } catch (e) {}

      // 3. Intentar por supplierInvoice
      try {
        const byInvoice = await getBySupplierInvoice(search);
        result.push(...byInvoice);
      } catch (e) {}

      // Eliminar duplicados por clothId
      result = result.filter(
        (cloth, index, self) =>
          index === self.findIndex((c) => c.clothId === cloth.clothId)
      );
    }

    // Aplicar otros filtros si vienen
    if (!filters.value.name || hasOtherFilters) {
      if (filters.value.categoryId) {
        const byCat = await getClothByCategory(
          Number(filters.value.categoryId)
        );
        result = mergeResults(result, byCat);
      }

      if (filters.value.supplierId) {
        const bySup = await getClothBySupplier(filters.value.supplierId);
        result = mergeResults(result, bySup);
      }

      if (filters.value.status === "active") {
        const actives = await getIsActive();
        result = mergeResults(result, actives);
      } else if (filters.value.status === "inactive") {
        const inactives = await getIsNotActive();
        result = mergeResults(result, inactives);
      }

      if (!filters.value.name && !hasOtherFilters) {
        result = await getAllCloths();
      }
    }

    cloths.value = result;
  } catch (e) {
    toast.error("Error al aplicar filtros");
  }
};

// 🔧 Función para combinar resultados sin duplicados
function mergeResults(base: any[], incoming: any[]): any[] {
  const ids = new Set(base.map((c) => c.clothId));
  const filtered = incoming.filter((c) => !ids.has(c.clothId));
  return [...base, ...filtered];
}

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

<template>
  <div>
    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal-backdrop d-flex justify-content-center align-items-center"
    >
      <div
        class="modal-content p-4 rounded bg-white shadow"
        style="width: 400px"
      >
        <h5>{{ isEditing ? "Editar Usuario" : "Crear Usuario" }}</h5>
        <form @submit.prevent="submitUser">
          <input
            class="form-control mb-2"
            v-model="formUser.name"
            placeholder="Nombre"
            required
          />
          <input
            class="form-control mb-2"
            v-model="formUser.email"
            type="email"
            placeholder="Email"
            required
          />
          <div class="input-group mb-2">
            <input
              class="form-control"
              v-model="formUser.password"
              :type="showPassword ? 'text' : 'password'"
              :required="!isEditing"
              placeholder="Contraseña"
            />
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "Ocultar" : "Ver" }}
            </button>
          </div>

          <select class="form-select mb-3" v-model="formUser.role">
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="EDITOR">EDITOR</option>
            <option value="VIEWER">VIEWER</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <button type="submit" class="btn btn-primary w-100">
            {{ isEditing ? "Actualizar" : "Crear" }}
          </button>
        </form>
        <button
          class="btn btn-link mt-2 w-100 text-danger"
          @click="showModal = false"
        >
          Cancelar
        </button>
        <div class="mt-3 text-muted small" v-if="isEditing">
          <div>📅 Creado: {{ formatDate(formUser.createdAt) }}</div>
          <div
            v-if="
              formUser.updatedAt && formUser.updatedAt !== formUser.createdAt
            "
          >
            ✏️ Actualizado: {{ formatDate(formUser.updatedAt) }}
          </div>
        </div>
      </div>
    </div>

    <h2 class="mb-4">Usuarios</h2>

    <div class="mb-3" v-if="canCreate">
      <button class="btn btn-primary" @click="openCreateModal">
        Crear Usuario
      </button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userId">
          <td>{{ user.userId }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button
              class="btn btn-sm btn-warning me-2"
              @click="openEditModal(user.userId)"
              v-if="canEdit"
            >
              Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/auth";
import { useToast } from "vue-toastification";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/UserService";

const toast = useToast();
const authStore = useAuthStore();
const users = ref<any[]>([]);
const showModal = ref(false);

const formUser = ref({
  userId: 0,
  name: "",
  email: "",
  password: "",
  role: "VIEWER",
  createdAt: null,
  updatedAt: null,
});

const isEditing = ref(false);

const canCreate = ["SUPER_ADMIN", "ADMIN"].includes(authStore.role);
const canEdit = ["SUPER_ADMIN", "ADMIN"].includes(authStore.role);
const canDelete = authStore.role === "SUPER_ADMIN";

const fetchUsers = async () => {
  try {
    users.value = await getAllUsers();
  } catch (e) {
    toast.error("Error al cargar los usuarios");
  }
};

const openCreateModal = () => {
  if (!canCreate) return toast.error("No autorizado para crear");
  isEditing.value = false;
  formUser.value = {
    id: 0,
    name: "",
    email: "",
    password: "",
    role: "VIEWER",
  };
  showModal.value = true;
};

const openEditModal = async (id: number) => {
  if (!canEdit) return toast.error("No autorizado para editar");
  try {
    const user = await getUserById(id);
    formUser.value = { ...user, password: "" }; // ⚠️ no mostrar contraseña
    isEditing.value = true;
    showModal.value = true;
  } catch (e) {
    toast.error("Error al obtener usuario");
  }
};

const submitUser = async () => {
  try {
    if (isEditing.value) {
      await updateUser(formUser.value);
      toast.success("Usuario actualizado");
    } else {
      await createUser(formUser.value);
      toast.success("Usuario creado");
    }
    showModal.value = false;
    fetchUsers();
  } catch (e) {
    toast.error("Error al guardar usuario");
  }
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

const showPassword = ref(false);

onMounted(fetchUsers);
</script>

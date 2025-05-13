<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a class="navbar-brand" href="/">Corte Arapos</a>

      <div class="ms-auto d-flex align-items-center text-white gap-3">
        <ul class="navbar-nav d-flex flex-row gap-3">
          <li v-for="link in visibleLinks" :key="link.path" class="nav-item">
            <router-link class="nav-link" :to="link.path">
              {{ link.name }}
            </router-link>
          </li>
        </ul>

        <div
          v-if="authStore.isAuthenticated"
          class="ms-4 d-flex align-items-center gap-2"
        >
          <span>{{ authStore.name }} ({{ authStore.role }})</span>
          <button class="btn btn-outline-light" @click="logout">Logout</button>
        </div>
      </div>
    </nav>

    <main class="container my-4">
      <slot />
    </main>

    <footer class="bg-dark text-white text-center py-3">
      &copy; 2025 - Corte Arapos
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { computed } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const moduleAccess = {
  categories: ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"],
  cloths: ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"],
  references: ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"],
  suppliers: ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"],
  users: ["SUPER_ADMIN", "ADMIN", "VIEWER"],
};

// Define qué links mostrar
const visibleLinks = computed(() => {
  const role = authStore.role;
  return [
    { name: "Categories", path: "/categories", key: "categories" },
    { name: "Cloths", path: "/cloths", key: "cloths" },
    { name: "References", path: "/references", key: "references" },
    { name: "Suppliers", path: "/suppliers", key: "suppliers" },
    { name: "Users", path: "/users", key: "users" },
  ].filter((link) => moduleAccess[link.key].includes(role));
});
</script>

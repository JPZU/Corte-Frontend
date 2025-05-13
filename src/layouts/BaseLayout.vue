<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a class="navbar-brand" href="/">Corte Arapos</a>
      <div class="ms-auto">
        <span v-if="authStore.isAuthenticated">
          <button class="btn btn-outline-light" @click="logout">Logout</button>
        </span>
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

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

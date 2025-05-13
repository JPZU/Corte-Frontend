<template>
  <div
    class="login-wrapper d-flex justify-content-center align-items-center vh-100 bg-light"
  >
    <div
      class="login-card p-4 shadow rounded bg-white"
      style="min-width: 320px"
    >
      <h2 class="mb-4">Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label>Email</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label>Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Entrar</button>
      </form>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { login } from "@/services/AuthService";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    const token = await login(email.value, password.value);
    authStore.login(token);
    await nextTick();
    router.push("/");
  } catch (e) {
    error.value = "Credenciales inválidas";
  }
};
</script>

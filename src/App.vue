<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import BaseLayout from "@/layouts/BaseLayout.vue";

const route = useRoute();

// Si la ruta es '/login', no usamos layout (solo router-view plano)
const layout = computed(() => {
  return route.path === "/login" ? "div" : BaseLayout;
});
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">Listado de Operaciones</h2>

    <div v-if="ops.length === 0" class="alert alert-warning">
      No hay operaciones registradas.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-bordered">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Consecutivo</th>
            <th>Usuario</th>
            <th>Metros totales</th>
            <th>Tamaño trazo</th>
            <th>Cantidad prendas</th>
            <th>Descripción</th>
            <th>Fecha de creación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="op in ops" :key="op.id">
            <td>{{ op.opId }}</td>
            <td>{{ op.consecutiveNumber }}</td>
            <td>{{ op.user.name }}</td>
            <td>{{ op.totalMeters }}m</td>
            <td>{{ op.schemaLength }}m</td>
            <td>{{ op.quantityCloths }}</td>
            <td>{{ op.descriptions }}</td>
            <td>{{ formatDate(op.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllOps } from "@/services/OpService";

const ops = ref([]);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

onMounted(async () => {
  ops.value = await getAllOps();
});
</script>

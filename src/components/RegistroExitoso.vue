<template>
  <v-dialog v-model="show" max-width="360" persistent>
    <v-card class="pa-4 rounded-lg" style="border: 2px solid #3A0CA3;">
      <v-card-title class="d-flex align-center pb-2">
        <v-avatar size="36" class="me-3" color="#3A0CA3">
          <v-icon color="white">mdi-check</v-icon>
        </v-avatar>
        <div class="text-start">
          <div class="text-subtitle-1 font-weight-bold" style="color: #3A0CA3;">Success!</div>
          <div class="text-body-2" style="color: #3A0CA3;">Se ha registrado exitosamente</div>
        </div>
      </v-card-title>
      <v-card-actions class="justify-center pt-4">
        <v-btn
          variant="text"
          class="rounded-pill text-capitalize"
          style="color: #3A0CA3"
          @click="show = false"
        >
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(true)
</script>

<style scoped>
.v-dialog__content {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>


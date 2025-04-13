<template>
    <v-dialog v-model="show" max-width="300" persistent>
      <v-card class="pa-4 rounded-lg" style="border: 2px solid #3A0CA3;">
        <v-card-title class="d-flex align-center pb-2">
          <v-avatar size="36" class="me-3" color="#3A0CA3">
            <v-icon color="white">mdi-information-variant</v-icon>
          </v-avatar>
          <div class="text-start">
            <div class="text-subtitle-1 font-weight-bold" style="color: #3A0CA3;">Info</div>
            <div class="text-body-2" style="color: #3A0CA3;">¿Guardar Información?</div>
          </div>
        </v-card-title>
        <v-card-actions class="justify-center pt-4">
          <v-btn
            variant="text"
            class="rounded-pill text-capitalize"
            style="color: #9c9c9c"
            @click="onCancel"
          >
            No
          </v-btn>
          <v-btn
            variant="text"
            class="rounded-pill text-capitalize"
            style="color: #3A0CA3"
            @click="onConfirm"
          >
            Sí
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const show = ref(true)
  
  const onCancel = () => {
    show.value = false
    // Puedes emitir un evento o manejarlo desde un prop
    console.log('Cancelado')
  }
  
  const onConfirm = () => {
    show.value = false
    // Aquí puedes redirigir o cerrar sesión
    console.log('Confirmado: cerrar sesión')
  }
  </script>
  
  <style scoped>
  .v-dialog__content {
    background-color: rgba(0, 0, 0, 0.5);
  }
  </style>
  
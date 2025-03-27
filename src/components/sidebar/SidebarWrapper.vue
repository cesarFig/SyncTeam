<!-- src/components/sidebar/SidebarWrapper.vue -->
<template>
  <div>
    <!-- Selector temporal de rol -->
    <v-btn 
      class="role-toggle"
      @click="roleStore.toggleRole"
      color="azul4"
      small
    >
      Cambiar a {{ roleStore.isAdmin ? 'Trabajador' : 'Admin' }}
    </v-btn>

    <!-- Sidebar dinámico -->
    <component :is="currentSidebar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoleStore } from '@/stores/roleStore' // Cambiado la ruta
import AdminSidebar from './AdminSidebar.vue'
import WorkerSidebar from './WorkerSidebar.vue'

const roleStore = useRoleStore()
const currentSidebar = computed(() => roleStore.isAdmin ? AdminSidebar : WorkerSidebar)
</script>

<style scoped>
.role-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>

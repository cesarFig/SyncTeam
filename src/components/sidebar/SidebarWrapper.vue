<!-- src/components/sidebar/SidebarWrapper.vue -->
<template>
  <div>
    <!-- Selector temporal de rol -->
    

    <!-- Sidebar dinámico -->
    <component :is="currentSidebar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AdminSidebar from './AdminSidebar.vue'
import WorkerSidebar from './WorkerSidebar.vue'

const currentSidebar = computed(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};  // Default a objeto vacío si no se encuentra  
  return usuario.rol=== 'Administrador' ? AdminSidebar : WorkerSidebar
})
</script>

<style scoped>
.role-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>

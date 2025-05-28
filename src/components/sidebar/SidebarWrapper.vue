<template>
  <div>    
    <component :is="currentSidebar" />       
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoleStore } from '@/stores/roleStore'
import AdminSidebar from './AdminSidebar.vue'
import WorkerSidebar from './WorkerSidebar.vue'

const roleStore = useRoleStore()

onMounted(() => {
  roleStore.loadRoleFromStorage()
})

const currentSidebar = computed(() =>
  roleStore.currentRole === 1 ? AdminSidebar : WorkerSidebar
)


</script>

<style scoped>
.role-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>

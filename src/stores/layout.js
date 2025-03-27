import { defineStore } from 'pinia'
import { ref, computed, onMounted, onUnmounted } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
    /* eslint-disable */
  const isCollapsed = ref(false)
  const windowWidth = ref(window.innerWidth) // Referencia reactiva para el ancho de la ventana

  // Computed para determinar si la pantalla es "móvil" (ancho < 700px)
  const isMobile = computed(() => windowWidth.value < 700)

  const sidebarWidth = computed(() => {
    return isMobile.value 
      ? 70 // 20% del ancho de la pantalla para móvil
      : isCollapsed.value 
        ? Math.max(windowWidth.value * 0.05, 65) // 5% del ancho de la pantalla cuando está colapsado
        : windowWidth.value * 0.20 // 20% del ancho de la pantalla cuando está expandido
  })

  function toggleSidebar() {
    if (!isMobile.value) {
      isCollapsed.value = !isCollapsed.value
    }
  }

  // Listener para actualizar el ancho de la ventana al redimensionar
  function updateWindowWidth() {
    windowWidth.value = window.innerWidth
    if (!isMobile.value) {
        isCollapsed.value = !isCollapsed.value
      }
  }

  // Agregar y remover el listener en los ciclos de vida del componente
  onMounted(() => {
    window.addEventListener('resize', updateWindowWidth)
    updateWindowWidth()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth)
  })

  return { isCollapsed, isMobile, sidebarWidth, toggleSidebar }
})
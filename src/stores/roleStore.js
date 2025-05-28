import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', {
  state: () => ({
    currentRole: 2 // valor por defecto: worker/creativo
  }),
  actions: {
    loadRoleFromStorage() {
      const userRaw = localStorage.getItem('usuario')
      try {
        const user = JSON.parse(userRaw)
        this.currentRole = parseInt(user?.rol) || 2
      } catch {
        this.currentRole = 2
      }
    },
    setRole(rol) {
      this.currentRole = rol
      const userRaw = localStorage.getItem('usuario')
      const user = userRaw ? JSON.parse(userRaw) : {}
      user.rol = rol
      localStorage.setItem('usuario', JSON.stringify(user))
    }
  },
  getters: {
    isAdmin: (state) => state.currentRole === 1
  }
})

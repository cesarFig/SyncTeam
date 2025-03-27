// src/stores/roleStore.js
import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', {
  state: () => ({
    currentRole: 'worker' // 'worker' o 'admin'
  }),
  actions: {
    toggleRole() {
      this.currentRole = this.currentRole === 'worker' ? 'admin' : 'worker'
    }
  },
  getters: {
    isAdmin: (state) => state.currentRole === 'admin'
  }
})
<template>
  <v-card class="mx-auto pa-4 rounded-xl h-100" max-width="500" elevation="2">

    <v-card-title class="text-h6 font-weight-bold">Notificaciones</v-card-title>    

    <v-list density="compact">
      <v-list-item
        v-for="(noti, index) in notifications"
        :key="index"
        class="px-0 py-3"
      >
        <v-row no-gutters class="w-100">
          <!-- Avatar -->
          <v-col cols="auto" class="d-flex align-start pr-3">
            <v-avatar
              size="40"
              :style="{ backgroundColor: getColor(noti.sender) }"
            >
              <span class="white--text font-weight-bold">
                {{ getInitials(noti.sender) }}
              </span>
            </v-avatar>
          </v-col>

          <!-- Contenido -->
          <v-col class="d-flex flex-column">
            <div class="d-flex justify-space-between align-start">
              <span class="font-weight-medium">{{ noti.sender }}</span>
              <span class="text-caption text-grey-darken-1">{{ formatDate(noti.date) }}</span>
            </div>
            <span class="text-body-2">{{ noti.message }}</span>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const notifications = ref([
  { sender: 'Carlos Gómez', message: 'Comentó en tu ticket', date: new Date() },
  { sender: 'Ana Ruiz', message: 'Asignó una tarea nueva', date: new Date(Date.now() - 3600 * 1000 * 5) }, // 5 horas antes
  { sender: 'Brenda Torres', message: 'Actualizó el estado del proyecto', date: new Date(Date.now() - 3600 * 1000 * 24) }, // ayer
  { sender: 'Luis Mena', message: 'Te mencionó en una nota', date: new Date(Date.now() - 3600 * 1000 * 48) } // anteayer
])

const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getColor = (name) => {
  const colors = ['#1976D2', '#E53935', '#8E24AA', '#FBC02D', '#009688', '#5C6BC0']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

const formatDate = (date) => {
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()

  const timeStr = d.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  })

  if (sameDay(d, today)) return `Hoy, ${timeStr}`
  if (sameDay(d, yesterday)) return `Ayer, ${timeStr}`
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short'
  }) + `, ${timeStr}`
}
</script>

<style scoped>
.white--text {
  color: white;
}
</style>

<template>
  <v-card class="fill-height d-flex flex-column pa-4 roundedLarge" elevation="2">
    <v-card-title class="text-h6 font-weight-bold mb-4">
      Notificaciones
    </v-card-title>

    <v-list density="comfortable">
      <v-list-item
        v-for="noti in notifications"
        :key="noti.id"
        class="py-2"
        :class="{
          'bg-white': true,
          'text-grey-darken-2': true
        }"
        @click="marcarComoLeida(noti)"
      >
        <v-row align="center" class="w-100">
          <!-- Avatar -->
          <v-col cols="auto" class="d-flex align-start">
            <v-avatar size="40" :style="{ backgroundColor: getColor(noti.sender) }" class="mr-3">
              <span class="white--text font-weight-bold">
                {{ getInitials(noti.sender) }}
              </span>
            </v-avatar>
          </v-col>

          <!-- Contenido -->
          <v-col class="d-flex flex-column justify-center">
            <span class="font-weight-medium">{{ noti.sender }}</span>
            <span class="font-weight-bold text-body-2">{{ noti.title }}</span>
            <span class="text-body-2">{{ noti.description }}</span>
            <span class="text-caption text--secondary">{{ formatDate(noti.timestamp) }}</span>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const notifications = ref([])

const cargarNotificaciones = async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const res = await fetch(`http://localhost:3000/api/notificaciones/${usuario.id}`)
    const data = await res.json()

    notifications.value = data.map(n => ({
      id: n.id,
      sender: `${n.sender_nombre} ${n.sender_apellidos}`,
      title: n.tipo_notificacion,
      description: n.mensaje,
      timestamp: n.fecha_creacion,
      unread: !n.is_read
    }))
  } catch (err) {
    console.error('Error cargando notificaciones:', err)
  }
}

const marcarComoLeida = async (noti) => {
  try {
    await fetch(`http://localhost:3000/api/notificaciones/read/${noti.id}`, {
      method: 'PUT'
    })
    noti.unread = false
  } catch (err) {
    console.error('Error al marcar como leída:', err)
  }
}

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

const formatDate = (timestamp) => {
  const d = new Date(timestamp)
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

onMounted(() => {
  cargarNotificaciones()
})
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.white--text {
  color: white;
}

.roundedLarge {
  border-radius: 16px;
}
</style>

<template>
  <v-card class="ticket-dashboard-card pa-4" elevation="2">
    <!-- Título -->
    <h3 class="text-h6 font-weight-bold mb-4">Tickets recientes</h3>

    <!-- Tarjetas en dos columnas -->
    <v-row dense no-gutters class="ticket-row">
      <v-col
        v-for="(ticket, index) in ticketsProximos"
        :key="ticket.id"
        cols="12"
        sm="6"
        class="ticket-col"
        :class="index % 2 === 0 ? 'pr-2' : 'pl-2'"
        @click="onTicketClick(ticket.id)"
      >
        <CardTicket
          :titulo="ticket.titulo"
          :descripcion="ticket.descripcion"
          :imagen="ticket.imagen"
          :fecha_vencimiento="ticket.fecha_vencimiento"
          :estado="ticket.estado"
          :nombre_categoria="ticket.categoria"
          :color_rgb="ticket.color_rgb"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue' // Added defineEmits
import axios from 'axios'
import CardTicket from '@/components/CardTicket.vue'

const emit = defineEmits(['ticket-clicked']) // Defined emits

const ticketsProximos = ref([])

const fetchTicketsProximos = async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const res = await axios.post('http://localhost:3000/api/usuarios/getTickets', {
      id: usuario.id
    })

    const data = Array.isArray(res.data) ? res.data : res.data.tickets || []

    const ordenados = data
      .filter(ticket => !!ticket.fecha_vencimiento)
      .sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento))

    ticketsProximos.value = ordenados.slice(0, 2).map(t => ({ ...t, id: t.id || t.ticket_id })); // Ensure id is present
  } catch (error) {
    console.error('Error al cargar tickets próximos:', error)
  }
}

const onTicketClick = (ticketId) => {
  emit('ticket-clicked', ticketId);
}

onMounted(() => {
  fetchTicketsProximos()
})
</script>

<style scoped>
.ticket-dashboard-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 16px;
  box-sizing: border-box;
}

.ticket-row {
  flex-grow: 1;
  align-items: stretch;
}

.ticket-col {
  display: flex;
}

.ticket-col > * {
  flex-grow: 1;
  width: 100%;
  max-height: 180px;
}
</style>

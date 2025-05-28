<template>
  <v-container fluid class="dashboard-layout pa-4">
    <v-row class="fill-height" no-gutters>
      <!-- COLUMNA IZQUIERDA (Agenda, Notis, Tickets, Resumen) -->
      <v-col cols="12" md="8" class="pa-2 h-100">
        <div class="d-flex flex-column h-100">
          <!-- FILA SUPERIOR -->
          <div
            class="d-flex flex-grow-1 flex-wrap mb-2"
            style="min-height: 0;"
          >
            <div
              class="pa-2 h-100"
              :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'"
            >
              <CalendarioCard />
            </div>
            <div
              class="pa-2 h-100"
              :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'"
            >
              <CardNotificaciones />
            </div>
          </div>

          <!-- FILA INFERIOR -->
          <div
            class="d-flex flex-grow-1 flex-wrap"
            style="min-height: 0;"
          >
            <div
              class="pa-2 h-100 d-flex flex-column"
              :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'"
            >
              <CardTicketDashboard />
            </div>
            <div
              class="pa-2 h-100 d-flex flex-column"
              :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'"
            >
              <ResumenTickets />
            </div>
          </div>
        </div>
      </v-col>

      <!-- COLUMNA DERECHA: Ticket activo (siempre vertical) -->
      <v-col cols="12" md="4" class="pa-2 h-100">
        <div class="ticket-activo-placeholder">
          <p class="placeholder-text">[ Aquí irá el componente de Ticket activo ]</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import CalendarioCard from '@/components/CalendarioCard.vue'
import CardNotificaciones from '@/components/CardNotificaciones.vue'
import CardTicketDashboard from '@/components/CardTicketsDashboard.vue'
import ResumenTickets from '@/components/ResumentTickets.vue'
</script>

<style scoped>
.dashboard-layout {
  height: 100vh;
  overflow: hidden;
}

.ticket-activo-placeholder {
  height: 100%;
  background-color: #f8f8f8;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  text-align: center;
  padding: 1rem;
}

.placeholder-text {
  color: #999;
  font-weight: 500;
  font-size: 1rem;
}
</style>

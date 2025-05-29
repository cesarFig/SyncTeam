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
      <v-col cols="12" md="4" class="pa-2 h-100 ticket-activo">
        <div v-if="isLoading" class="d-flex justify-center align-center fill-height">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-else-if="error" class="d-flex justify-center align-center fill-height pa-4">
          <v-alert type="error" dense elevation="2" prominent>
            Error al cargar el ticket: {{ error }}
          </v-alert>
        </div>
        <DashboardTicket
          v-else-if="ticketData"
          :ticketId="ticketData.ticketId"
          :tituloTicket="ticketData.tituloTicket"
          :pautaNombre="ticketData.pautaNombre"
          :progreso="ticketData.progreso"
          :horasRestantes="ticketData.horasRestantes"
          :imagenPrincipal="ticketData.imagenPrincipal"
          :rolAsignado="ticketData.rolAsignado"
          :descripcion="ticketData.descripcion" 
        />
        <div v-else class="ticket-activo-null">
          <p class="placeholder-text">No hay tickets activos próximos.</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CalendarioCard from '@/components/CalendarioCard.vue'
import CardNotificaciones from '@/components/CardNotificaciones.vue'
import CardTicketDashboard from '@/components/CardTicketsDashboard.vue'
import ResumenTickets from '@/components/ResumentTickets.vue'
import DashboardTicket from '@/components/DashboardTicket.vue';

const ticketData = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  const userRaw = localStorage.getItem('usuario')
  const userId = userRaw ? JSON.parse(userRaw).id : null;

  if (!userId) {
    error.value = 'Usuario no identificado para cargar ticket.';
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    const response = await fetch(`/api/ticketDashboard/${userId}`);

    if (!response.ok) {
      let errorMsg = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (e) {
        // Could not parse error JSON
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();

    if (data) {
      ticketData.value = {
        ticketId: data.ticketId,
        tituloTicket: data.tituloTicket,
        pautaNombre: data.pautaNombre,
        progreso: data.progreso,
        horasRestantes: data.horasRestantes,
        imagenPrincipal: data.imagenPrincipal,
        rolAsignado: data.rolAsignado,
        descripcion: data.descripcion || (data.detalles && typeof data.detalles.descripcion === 'string' ? data.detalles.descripcion : 'Descripción no proporcionada')
      };
    } else {
      ticketData.value = null; // No active ticket found
    }
  } catch (err) {
    console.error('Error al cargar el ticket activo del dashboard:', err);
    error.value = err.message || 'Ocurrió un error desconocido.';
  } finally {
    isLoading.value = false;
  }
});

</script>

<style scoped>
.dashboard-layout {
  height: 100vh;
  background-color: #F3F4F8;
  overflow: hidden;
}

.ticket-activo-null {
  height: 100%;
  background-color: #f8f8f8; /* Light grey background */
  border-radius: 16px; /* Consistent with DashboardTicket */
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #e0e0e0; /* Softer dashed border */
  text-align: center;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Subtle shadow */
}

.ticket-activo {
  height: 100%; 
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
}

.placeholder-text {
  color: #757575; /* Darker grey for better readability */
  font-weight: 500;
  font-size: 1rem;
}
</style>

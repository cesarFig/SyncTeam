<template>
  <v-container fluid class="dashboard-layout pa-2"> <!-- Changed pa-4 to pa-2 -->
    <v-row class="fill-height" no-gutters>
      <!-- COLUMNA IZQUIERDA (Agenda, Notis, Tickets, Resumen) -->
      <v-col cols="12" md="8" class="h-100"> <!-- Removed pa-2 -->
        <div class="d-flex flex-column h-100">
          <!-- FILA SUPERIOR -->
          <div class="d-flex flex-grow-1 flex-wrap" style="min-height: 65%; max-height: 65%;"> <!-- Removed mb-2 -->
            <div class="pa-2 h-100" :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'">
              <CalendarioCard />
            </div>
            <div class="pa-2 h-100" :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'">
              <CardNotificaciones />
            </div>
          </div>

          <!-- FILA INFERIOR -->
          <div class="d-flex flex-grow-1 flex-wrap" style="min-height: 0;">
            <div class="pa-2 h-100 d-flex flex-column" :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'">
              <CardTicketDashboard @ticket-clicked="handleOpenTicketDetails" />
            </div>
            <div class="pa-2 h-100 d-flex flex-column" :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'">
              <ResumenTickets />
            </div>
          </div>
        </div>
      </v-col>

      <!-- COLUMNA DERECHA: Ticket activo (siempre vertical) -->
      <v-col cols="12" md="4" class="h-100 ticket-activo"> <!-- Removed pa-2 -->
        <div class="pa-2 h-100 d-flex flex-column"> <!-- Added wrapper with pa-2 -->
          <div v-if="isLoading" class="d-flex justify-center align-center flex-grow-1"> <!-- Added flex-grow-1 -->
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else-if="error" class="d-flex justify-center align-center flex-grow-1 pa-4"> <!-- Added flex-grow-1 -->
            <v-alert type="error" dense elevation="2" prominent>
              Error al cargar el ticket: {{ error }}
            </v-alert>
          </div>
          <DashboardTicket v-else-if="ticketData" :ticketId="ticketData.ticketId" :tituloTicket="ticketData.tituloTicket"
            :pautaNombre="ticketData.pautaNombre" :progreso="ticketData.progreso"
            :horasRestantes="ticketData.horasRestantes" :imagenPrincipal="ticketData.imagenPrincipal"
            :rolAsignado="ticketData.rolAsignado" :descripcion="ticketData.descripcion"
            @open-ticket-details="handleOpenTicketDetails" class="flex-grow-1" /> <!-- Added flex-grow-1 -->
          <div v-else class="ticket-activo-null flex-grow-1 d-flex flex-column align-center justify-center">
            <img src="https://icons.veryicon.com/png/o/education-technology/big-data-ico-02/new-task.png" alt="Sin tickets activos" style="width:90px;height:90px;opacity:0.6;" />
            <p class="placeholder-text mt-3">No hay tickets activos.</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="showTicketFullDialog" max-width="800">
      <TicketFull v-if="selectedTicketFull" :ticket="selectedTicketFull" @close-modal="closeTicketFull" @attachment-uploaded="handleAttachmentUploaded" />
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CalendarioCard from '@/components/CalendarioCard.vue'
import CardNotificaciones from '@/components/CardNotificaciones.vue'
import CardTicketDashboard from '@/components/CardTicketsDashboard.vue'
import ResumenTickets from '@/components/ResumentTickets.vue'
import DashboardTicket from '@/components/DashboardTicket.vue';
import TicketFull from '@/components/TicketFull.vue'; // Import TicketFull
import axios from 'axios'; // Import axios for fetching full ticket details

const ticketData = ref(null);
const isLoading = ref(true);
const error = ref(null);

const showTicketFullDialog = ref(false);
const selectedTicketFull = ref(null);

const closeTicketFull = () => {
  showTicketFullDialog.value = false;
  selectedTicketFull.value = null;
};

const handleAttachmentUploaded = async () => {
  if (selectedTicketFull.value && selectedTicketFull.value.id) {
    try {
      const response = await axios.get(`/api/ticket/${selectedTicketFull.value.id}`);
      const ticket = response.data;
      const transformedTicket = {
        id: ticket.id,
        title: ticket.titulo,
        description: ticket.descripcion,
        taskType: {
          name: ticket.nombre_categoria || 'Sin categoría',
          color: ticket.color_rgb || '#757575'
        },
        priority: {
          name: ticket.prioridad || 'Normal',
          color: getPriorityColor(ticket.nivel_prioridad)
        },
        image: ticket.imagen,
        date: ticket.fecha_creacion,
        assignee: `${ticket.asignado_nombre || ''} ${ticket.asignado_apellidos || ''}`.trim(),
        attachments: ticket.attachments || [], // Ensure attachments are updated
        activityLog: [], // Populate if available
        currentUser: { name: "Tú", avatar: "" }, // Adjust as needed

        // Raw fields for editing
        titulo: ticket.titulo,
        descripcion: ticket.descripcion,
        imagen: ticket.imagen,
        prioridad_id: ticket.prioridad_id,
        categoria_id: ticket.categoria_id,
        pauta_id: ticket.pauta_id,
        usuario_id: ticket.usuario_id,
        hora_inicio: ticket.hora_inicio,
        hora_final: ticket.hora_final,
        fecha_vencimiento: ticket.fecha_vencimiento
      };
      selectedTicketFull.value = transformedTicket;
      // Optionally, you might want to refresh other parts of the dashboard
      // that depend on ticket data, if any.
    } catch (err) {
      console.error('Error refreshing full ticket details after upload:', err);
      error.value = 'No se pudieron actualizar los detalles del ticket después de la subida.';
    }
  }
};

// Function to get priority color (copied from TicketsCreativoView.vue)
const getPriorityColor = (nivel) => {
  switch (nivel) {
    case 1: return '#42A5F5'; // Normal
    case 2: return '#FFA726'; // Baja
    case 3: return '#EF5350'; // Alta
    case 4: return '#D32F2F'; // Crítica
    default: return '#BDBDBD';
  }
};

const handleOpenTicketDetails = async (ticketId) => {
  try {
    // Fetch the full ticket details using the ticketId
    const response = await axios.get(`/api/ticket/${ticketId}`);
    const ticket = response.data;

    // Transform the ticket data to the format expected by TicketFull.vue
    const transformedTicket = {
      id: ticket.id,
      title: ticket.titulo,
      description: ticket.descripcion,
      taskType: {
        name: ticket.nombre_categoria || 'Sin categoría',
        color: ticket.color_rgb || '#757575'
      },
      priority: {
        name: ticket.prioridad || 'Normal',
        color: getPriorityColor(ticket.nivel_prioridad)
      },
      image: ticket.imagen,
      date: ticket.fecha_creacion,
      assignee: `${ticket.asignado_nombre || ''} ${ticket.asignado_apellidos || ''}`.trim(),
      attachments: ticket.attachments || [], // Ensure attachments are populated initially
      activityLog: [], // Populate if available
      currentUser: { name: "Tú", avatar: "" }, // Adjust as needed

      // Raw fields for editing
      titulo: ticket.titulo,
      descripcion: ticket.descripcion,
      imagen: ticket.imagen,
      prioridad_id: ticket.prioridad_id,
      categoria_id: ticket.categoria_id,
      pauta_id: ticket.pauta_id,
      usuario_id: ticket.usuario_id,
      hora_inicio: ticket.hora_inicio,
      hora_final: ticket.hora_final,
      fecha_vencimiento: ticket.fecha_vencimiento
    };

    selectedTicketFull.value = transformedTicket;
    showTicketFullDialog.value = true;
  } catch (err) {
    console.error('Error fetching full ticket details:', err);
    // Optionally, show an error message to the user
    error.value = 'No se pudieron cargar los detalles completos del ticket.';
  }
};

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

.h-100 {
  height: 100%;
}

.w-50 {
  width: 50% !important;
}

.w-100 {
  width: 100% !important;
}

.ticket-activo {
  /* Ensures this column tries to maintain its height if content is less */
  display: flex;
  flex-direction: column;
}

.ticket-activo-null {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /* Take full height of its container */
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.placeholder-text {
  font-size: 1.1rem;
  color: #777;
  text-align: center;
  padding: 20px;
}
</style>

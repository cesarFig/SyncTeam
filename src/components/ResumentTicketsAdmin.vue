<template>
  <div class="resumen-tickets">
    <div v-if="isLoading" class="loading-message">Cargando estadísticas...</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <template v-if="!isLoading && !errorMessage">
      <div class="ticket-box purple">
        <v-icon size="28" class="mr-2">mdi-check-circle</v-icon>
        <div>
          <div class="count">{{ ticketsTotales }}</div>
          <div class="label">Tickets totales</div>
        </div>
      </div>
      <div style="display:flex; gap: 12px;">
        <div class="ticket-box magenta" style="flex-grow: 1;">
          <v-icon size="28" class="mr-2">mdi-email-open</v-icon>
          <div>
            <div class="count">{{ pendientesRevision }}</div>
            <div class="label">Pendientes<br>revisión</div>
          </div>
        </div>

        <div class="ticket-box blue" style="flex-grow: 1;">
          <v-icon size="28" class="mr-2">mdi-progress-clock</v-icon>
          <div>
            <div class="count">{{ enProgreso }}</div>
            <div class="label">En progreso</div>
          </div>
        </div>
      </div>

      <div style="display:flex; gap: 12px;">
        <div class="ticket-box cyan" style="flex-grow: 1;">
          <v-icon size="28" class="mr-2">mdi-bell-ring</v-icon>
          <div>
            <div class="count">{{ pendientes }}</div>
            <div class="label">Pendientes</div>
          </div>
        </div>
        <div class="ticket-box green" style="flex-grow: 1;">
          <v-icon size="28" class="mr-2">mdi-check-decagram</v-icon>
          <div>
            <div class="count">{{ completados }}</div>
            <div class="label">Completados</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const ticketsTotales = ref(0);
const pendientesRevision = ref(0);
const enProgreso = ref(0);
const pendientes = ref(0);
const completados = ref(0);
const isLoading = ref(true);
const errorMessage = ref('');

const fetchTicketStats = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const userDataString = localStorage.getItem('usuario');
    if (!userDataString) {
      throw new Error('No se encontró información del usuario en localStorage.');
    }
    
    const userData = JSON.parse(userDataString);
    const userId = userData.id; // Assuming 'id_usuario' is the key in the stored user object

    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario desde localStorage.');
    }

    const response = await fetch(`http://localhost:3000/api/dashboard/TicketsStats/Todos`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Error del servidor: ${errorData.message || response.statusText}`);
    }
    const data = await response.json();
    
    ticketsTotales.value = data.ticketsTotales !== undefined ? data.ticketsTotales : 0;
    pendientes.value = data.pendientes !== undefined ? data.pendientes : 0;
    enProgreso.value = data.enProgreso !== undefined ? data.enProgreso : 0;
    pendientesRevision.value = data.pendientesRevision !== undefined ? data.pendientesRevision : 0;
    completados.value = data.completados !== undefined ? data.completados : 0;

  } catch (err) {
    console.error('Error al cargar estadísticas de tickets:', err);
    errorMessage.value = err.message || 'Ocurrió un error al cargar las estadísticas.';
    // Reset counts on error
    ticketsTotales.value = 0;
    pendientes.value = 0;
    enProgreso.value = 0;
    pendientesRevision.value = 0;
    completados.value = 0;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchTicketStats();
});
</script>

<style scoped>
.resumen-tickets {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 300px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.ticket-box {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 16px;
  color: white;
  font-weight: bold;
  min-height: 56px;
  height: 80px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.count {
  font-size: 20px;
}

.label {
  font-size: 13px;
  line-height: 1.2;
}

.loading-message, .error-message {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
}

.loading-message {
  background-color: #f0f0f0;
  color: #333;
}

.error-message {
  background-color: #ffdddd;
  color: #d8000c;
  border: 1px solid #d8000c;
}

/* Colores personalizados */
.purple {
  background: linear-gradient(to right, #7b1fa2, #B14CF4);
}

.magenta {
  background: linear-gradient(to right, #B5179F, #E048CB);
}

.blue {
  background: linear-gradient(to right, #546FFF, #889BFF);
}

.cyan {
  background: linear-gradient(to right, #4BC9F1, #89E3FF);
}

.green {
  background: linear-gradient(to right, #43a047, #4DC17B);
}
</style>

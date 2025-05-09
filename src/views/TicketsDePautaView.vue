<template>
  <div class="contenedor-horizontal">

    <v-dialog v-model="showForm" max-width="500">
      <FormTicket @close="toggleForm" @save="handleSavePauta" />
    </v-dialog>

    <v-dialog v-model="showTicketFull" max-width="800">
      <TicketFull v-if="selectedTicket" :ticket="selectedTicket" @close="closeTicketFull" />
    </v-dialog>

    <v-card class="d-flex flex-column list-panel" style="width: 13%;">
      <div class="pa-4 flex-grow-0">
        <h2 class="text-h6 mb-4">Pautas</h2>
      </div>
      <v-list density="compact" class="flex-grow-1 list-scroll-area" lines="one">
        <v-list-item
          v-for="(pauta) in filteredPautas"
          :key="pauta.id"
          @click="selectPauta(pauta)"
          :class="{ 'selected-pauta': selectedPauta?.id === pauta.id }"
          class="pauta-list-item rounded-lg mx-1 my-1"
          :value="pauta.id"
        >
          <v-list-item-title class="list-item-title">{{ pauta.titulo }}</v-list-item-title>
          <v-list-item-subtitle class="list-item-subtitle">{{ pauta.subtitulo }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card class="d-flex flex-column detail-panel" width="20%" v-if="selectedPauta">
      <div class="detail-scroll-area pa-4">
        <h2 class="text-h5 font-weight-medium mb-3">{{ selectedPauta.titulo }}</h2>
        <v-img v-if="selectedPauta.imagen" :src="selectedPauta.imagen" height="180px" cover class="mb-4 rounded elevation-1"></v-img>
        <div class="mb-5"> <span class="text-subtitle-2 text-grey-darken-1">Cliente:</span> <span class="text-body-1 ml-2">{{ selectedPauta.cliente }}</span> </div>
        <div class="mb-5"> <h4 class="text-subtitle-1 font-weight-medium mb-2">Descripción</h4> <div class="description-block pa-3 rounded"> <p class="description-text">{{ selectedPauta.descripcion }}</p> </div> </div>
        <div class="mb-5"> <h4 class="text-subtitle-1 font-weight-medium mb-2">Colaboradores</h4> <v-list density="compact" class="pa-0"> <v-list-item v-for="(colab, i) in colaboradores" :key="i" class="px-1"> <template v-slot:prepend> <v-avatar color="grey-lighten-1" size="32" class="mr-3"> <v-icon color="white">mdi-account</v-icon> </v-avatar> </template> <v-list-item-title class="text-body-2">{{ colab }}</v-list-item-title> </v-list-item> </v-list> <p class="text-caption text-grey-darken-1 mt-2 ml-1"> <v-icon start size="small">mdi-calendar-blank-outline</v-icon> 8 Abril 2025 </p> </div>
        <div class="mb-5"> <h4 class="text-subtitle-1 font-weight-medium mb-2">Progreso </h4> <v-progress-linear :model-value="selectedPauta.progreso" color="blue-darken-2" height="8" rounded class="mb-1"></v-progress-linear> <p class="text-caption text-grey-darken-1 text-right">{{ selectedPauta.progreso }}%</p> </div>
        <div class="mb-2 pb-2"> <p class="text-body-2 d-flex align-center"> <v-icon start color="grey-darken-1">mdi-clock-time-three-outline</v-icon> <span class="text-grey-darken-1">{{ selectedPauta.diasRestantes }} Día(s) restante(s)</span> </p> </div>
      </div>
      <div class="mt-auto pa-4 pt-2 flex-grow-0 footer-action">
        <v-btn block variant="text" color="grey-darken-1"> <v-icon start>mdi-pencil-outline</v-icon> Editar </v-btn>
      </div>
    </v-card>

    <v-card v-else class="pa-4 d-flex align-center justify-center" width="20%">
      <p class="text-grey">Seleccione una pauta para ver los detalles</p>
    </v-card>

    <v-card class="d-flex flex-column tickets-panel" style="flex-grow: 1;">
      <div class="pa-4 pb-2 d-flex justify-space-between align-center flex-grow-0">
        <h1 class="text-h5">
          <span class="text-grey-darken-1 font-weight-bold">
            {{ selectedPauta ? selectedPauta.titulo : 'Pauta' }} >
          </span>
          <span class="text-black font-weight-medium">Tickets</span>
        </h1>
        <div>
          <span class="text-caption mr-2">Prioridad:</span>
          <v-chip size="small" color="blue-lighten-4" text-color="blue-darken-1" class="mr-1">Normal</v-chip>
          <v-chip size="small" color="orange-lighten-4" text-color="orange-darken-1" class="mr-1">Baja</v-chip>
          <v-chip size="small" color="red-lighten-4" text-color="red-darken-1">Alta</v-chip>
        </div>
      </div>

      <div class="ticket-columns-container pa-4 pt-2 justify-space-between align-center">
        <div
          class="ticket-column"
          v-for="(column, index) in ticketColumns"
          :key="index"
          @dragover.prevent
          @drop="onDrop(index)"
        >
          <div class="column-header pa-2">
            <span class="column-title">{{ column.title }}</span>
            <v-spacer></v-spacer>
            <v-btn icon variant="text" size="x-small" color="grey">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </div>
          <div class="ticket-list">
            <TicketCard
              v-for="task in column.tickets"
              :key="task.id"
              v-bind="task"
              class="mb-2"
              draggable="true"
              @dragstart="onDragStart(task)"              
              @click="openTicketFull(task)"        
            />
          </div>
        </div>
      </div>
    </v-card>

    <v-btn @click="toggleForm" variant="outlined" class="btnAddPauta">Nuevo ticket</v-btn>

  </div>
</template>

<script>
/* eslint-disable */
import FormTicket from '../components/forms/FormTicket.vue';
import TicketCard from '../components/CardTicket.vue'; // Asegúrate que la ruta es correcta
import TicketFull from '../components/TicketFull.vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

export default {
  name: 'PautasView',
  components: { TicketCard, FormTicket, TicketFull },
  setup() {
    const route = useRoute();
    return { route };
  },
  data() {
    return {
      showForm: false,
      selectedPauta: null,
      pautas: [],
      tickets: [],
      colaboradores: [],
      showTicketFull: false,
      selectedTicket: null,
      draggedTicket: null,
      ticketColumns: [
        { title: 'Por hacer', state: 1, tickets: [] },
        { title: 'En progreso', state: 2, tickets: [] },
        { title: 'Revisión', state: 3, tickets: [] },
        { title: 'Terminado', state: 4, tickets: [] },
      ],
    };
  },
  computed: {
    filteredPautas() { return this.pautas; },
    todoTicket() { return this.tickets.filter(task => task.estado === 1); },
    inProgressTicket() { return this.tickets.filter(task => task.estado === 2); },
    reviewTicket() { return this.tickets.filter(task => task.estado === 3); },
    doneTicket() { return this.tickets.filter(task => task.estado === 4); }
  },
  methods: {
    async fetchPautas() {
      try {
        const response = await axios.get('/api/pautas');
        this.pautas = response.data;
        if (this.pautas.length > 0 && !this.selectedPauta) {
          this.selectPauta(this.pautas[0]);
        }
      } catch (error) {
        console.error('Error fetching pautas:', error);
      }
    },
    async fetchTickets(pautaId) {
      try {
        const response = await axios.get(`/api/pautas/${pautaId}/tickets`);
        this.tickets = response.data;
        console.log(this.tickets);
        // Distribute tickets into columns based on their state
        this.ticketColumns.forEach((column) => {
          column.tickets = this.tickets.filter(
            (ticket) => ticket.estado === column.state
          );
        });
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    },
    async fetchColaboradores(pautaId) {
      try {
        const response = await axios.get(`/api/pautas/${pautaId}/colaboradores`);
        return response.data.map(c => `${c.nombre} ${c.apellidos}`);
      } catch (error) {
        console.error('Error fetching colaboradores:', error);
        return [];
      }
    },
    toggleForm() { this.showForm = !this.showForm; },
    async selectPauta(pauta) {
      this.selectedPauta = {
        ...pauta,
        diasRestantes: pauta.dias_restantes,
        cliente: pauta.cliente
      };
      await this.fetchTickets(pauta.id);
      const colaboradores = await this.fetchColaboradores(pauta.id);
      this.colaboradores = colaboradores;
    },
    handleSavePauta(newPautaData) {
      const newPauta = {
        id: Date.now(),
        titulo: newPautaData.titulo || 'Nueva Pauta',
        subtitulo: newPautaData.subtitulo || 'Detalles pendientes',
        cliente: newPautaData.cliente || 'Cliente Desconocido',
        descripcion: newPautaData.descripcion || 'Sin descripción.',
        colaboradores: newPautaData.colaboradores || [],
        fecha: new Date().toISOString().split('T')[0],
        imagen: newPautaData.imagen || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        progreso: newPautaData.progreso || 0,
        diasRestantes: newPautaData.diasRestantes || 0,
      };
      this.pautas.push(newPauta);
      this.selectedPauta = newPauta;
      this.showForm = false;
    },
    openTicketFull(ticket) {
      this.selectedTicket = ticket;
      this.showTicketFull = true;
    },
    closeTicketFull() {
      this.showTicketFull = false;
      this.selectedTicket = null;
    },
    onDragStart(ticket) {
      this.draggedTicket = ticket;
    },
    onDrop(targetColumnIndex) {
      if (!this.draggedTicket) return;

      const targetColumn = this.ticketColumns[targetColumnIndex];
      if (this.draggedTicket.estado !== targetColumn.state) {
        this.draggedTicket.estado = targetColumn.state;
        this.updateTicketState(this.draggedTicket);

        // Remove ticket from its current column
        this.ticketColumns.forEach((column) => {
          column.tickets = column.tickets.filter(
            (t) => t.id !== this.draggedTicket.id
          );
        });

        // Add ticket to the target column
        targetColumn.tickets.push(this.draggedTicket);
      }

      this.draggedTicket = null;
    },
    updateTicketState(ticket) {
      // Call API to update the ticket state in the backend
      axios
        .put(`/api/pautas/tickets/${ticket.id}`, { estado: ticket.estado })
        .then(() => {
          console.log('Ticket state updated successfully');
        })
        .catch((error) => {
          console.error('Error updating ticket state:', error);
        });
    },
  },
  mounted() {
    this.fetchPautas().then(() => {
      const pautaId = this.route.query.id;
      if (pautaId) {
        const pauta = this.pautas.find(p => p.id === parseInt(pautaId));
        if (pauta) {
          this.selectPauta(pauta);
        }
      }
    });
  }
};
</script>

<style scoped>
/* Importar Poppins */
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap'); */

.contenedor-horizontal {
  display: flex; flex-direction: row; height: 100%; width: 100%;
  gap: 0; background-color: #f8f8fa; overflow: hidden;
}

.list-panel, .detail-panel, .tickets-panel {
  height: 100%; border-right: 1px solid #e0e0e0; background-color: #ffffff;
  display: flex; flex-direction: column; position: relative; overflow: hidden;
}
.tickets-panel { border-right: none; background-color: #F3F4F8; }

/* Areas de scroll internas */
.list-scroll-area, .detail-scroll-area, .ticket-list /* .ticket-list ahora tiene scroll */ {
  overflow-y: auto; flex-grow: 1; flex-basis: 0;
}

/* Estilo scrollbar */
.list-scroll-area::-webkit-scrollbar,
.detail-scroll-area::-webkit-scrollbar,
.description-block::-webkit-scrollbar,
.ticket-columns-container::-webkit-scrollbar,
.ticket-list::-webkit-scrollbar
{ height: 6px; width: 5px; }

.list-scroll-area::-webkit-scrollbar-track,
.detail-scroll-area::-webkit-scrollbar-track,
.description-block::-webkit-scrollbar-track,
.ticket-columns-container::-webkit-scrollbar-track,
.ticket-list::-webkit-scrollbar-track
 { background: #f1f1f1; border-radius: 3px; }

.list-scroll-area::-webkit-scrollbar-thumb,
.detail-scroll-area::-webkit-scrollbar-thumb,
.description-block::-webkit-scrollbar-thumb,
.ticket-columns-container::-webkit-scrollbar-thumb,
.ticket-list::-webkit-scrollbar-thumb
{ background: #c1c1c1; border-radius: 3px; }

.list-scroll-area::-webkit-scrollbar-thumb:hover,
.detail-scroll-area::-webkit-scrollbar-thumb:hover,
.description-block::-webkit-scrollbar-thumb:hover,
.ticket-columns-container::-webkit-scrollbar-thumb:hover,
.ticket-list::-webkit-scrollbar-thumb:hover
{ background: #a8a8a8; }


/* Estilos lista pautas */
.pauta-list-item { border-bottom: 1px solid #eee; transition: background-color 0.2s ease-in-out; }
.pauta-list-item:hover { background-color: #f5f5f5; }
.list-item-title { font-size: 0.85rem; line-height: 1.3; white-space: normal; font-weight: 500; }
.list-item-subtitle { font-size: 0.75rem; line-height: 1.2; white-space: normal; color: #757575; }
.selected-pauta { background-color: #e3f2fd !important; border-left: 3px solid #1976D2; }
.selected-pauta .list-item-title { font-weight: 700; color: #1976D2; }
.list-scroll-area .v-list-item:last-child { border-bottom: none; }

/* Estilos detalle pauta */
.description-block { background-color: #f5f5f5; border: 1px solid #eeeeee; max-height: 10rem; overflow-y: auto; position: relative; }
.description-text { font-family: 'Poppins', sans-serif; font-size: 12px; line-height: 1.6; color: #333; text-align: justify; hyphens: auto; }
.footer-action { border-top: 1px solid #e0e0e0; background-color: #ffffff; position: relative; z-index: 2; }

.ticket-columns-container {
  display: flex; gap: 16px; height: 100%;
  align-content: center;
  overflow-x: auto; overflow-y: hidden;
  flex-grow: 1;
}
.ticket-column {
  flex: 0 0 220px; height: 100%; background-color: #f5f5f5;
  border-radius: 8px; display: flex; flex-direction: column;
  overflow: hidden;
}
.column-header {
  display: flex; align-items: center; padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0; flex-shrink: 0;
  background-color: #ffffff; border-radius: 8px
}
.column-title { font-weight: 500; color: #333; font-size: 0.95rem; }
.ticket-list {
  padding: 12px 8px;
}

.btnAddPauta { position: fixed; bottom: 30px; right: 30px; z-index: 1000; background-color: #B5179E; color: white; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }

.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

@media (max-width: 1280px) { .card-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); } }

</style>
``` 
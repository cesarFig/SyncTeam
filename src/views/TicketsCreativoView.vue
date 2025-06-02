<template>
  <div class="contenedor-horizontal">


    <v-dialog v-model="showTicketFull" max-width="800">
      <TicketFull v-if="selectedTicket" :ticket="selectedTicket" @close-modal="closeTicketFull"
        @attachment-uploaded="handleAttachmentUploaded" />
    </v-dialog>
    <v-card class="d-flex flex-column tickets-panel" style="flex-grow: 1;">
      <div class="pa-4 pb-2 d-flex justify-space-between align-center flex-grow-0">
        <div>
          <span class="text-caption mr-2">Prioridad:</span>
          <v-chip size="small" color="blue" text-color="blue-darken-1" class="mr-1">Normal</v-chip>
          <v-chip size="small" color="orange" text-color="orange-darken-1" class="mr-1">Baja</v-chip>
          <v-chip size="small" color="red" text-color="red-darken-1">Alta</v-chip>
        </div>

        <v-row justify="end">
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="searchTerm" label="Buscar tickets" prepend-inner-icon="mdi-magnify"
              variant="outlined" density="compact" hide-details clearable @input="handleSearch" />
          </v-col>
          <v-col cols="6" sm="5" md="4"> <!-- Más ancho que antes -->
            <v-select v-model="orden" :items="ordenOptions" item-title="label" item-value="value" label="Ordenar por:"
              density="compact" variant="outlined" hide-details />
          </v-col>

        </v-row>
      </div>



      <div class="ticket-columns-container pa-4 pt-2 justify-space-between align-center">
        <div class="ticket-column" v-for="(column, index) in ticketColumns" :key="index" @dragover.prevent
          @drop="onDrop(index)">
          <div class="column-header pa-2">
            <span class="column-title">{{ column.title }}</span>
            <v-spacer></v-spacer>
            <v-btn icon variant="text" size="x-small" color="grey">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </div>
          <div class="ticket-list">
            <TicketCard v-for="task in column.tickets" :key="task.id" v-bind="task" class="mb-2" draggable="true"
              @dragstart="onDragStart(task)" @click="openTicketFull(task)" />
          </div>
        </div>
      </div>
    </v-card>



  </div>
</template>

<script>
/* eslint-disable */
import FormTicket from '../components/forms/FormTicket.vue';
import TicketCard from '../components/CardTicket.vue'; // Asegúrate que la ruta es correcta
import TicketFull from '../components/TicketFull.vue';
import axios from 'axios';

export default {
  name: 'PautasView',
  components: { TicketCard, FormTicket, TicketFull },
  data() {
    return {
      showForm: false,
      searchTerm: '',
      allTickets: [],  // Todos los tickets (sin filtrar)
      tickets: [],
      showTicketFull: false,
      selectedTicket: null,
      draggedTicket: null,
      ticketColumns: [
        { title: 'Por hacer', state: 1, tickets: [] },
        { title: 'En progreso', state: 2, tickets: [] },
        { title: 'Revisión', state: 3, tickets: [] },
        { title: 'Terminado', state: 4, tickets: [] },
      ], orden: 'mayor', // Valor por defecto
      ordenOptions: [
        { label: 'Dias restantes (mayor)', value: 'mayor' },
        { label: 'Dias restantes (menor)', value: 'menor' },
        { label: 'Prioridad ', value: 'prioridad' } // Cambiado el texto
      ],
    };
  },

  computed: {
    filteredPautas() { return this.pautas; },
    todoTicket() { return this.tickets.filter(task => task.estado === 1); },
    inProgressTicket() { return this.tickets.filter(task => task.estado === 2); },
    reviewTicket() { return this.tickets.filter(task => task.estado === 3); },
    doneTicket() { return this.tickets.filter(task => task.estado === 4); }
  }, watch: {
    orden() {
      this.ordenarTickets();
    }
  },
  methods: {
    handleSearch() {
      const term = this.searchTerm?.toLowerCase() || '';

      if (!term) {
        // Si no hay término, mostrar todos los tickets
        this.tickets = [...this.allTickets];
      } else {
        // Filtrar tickets que coincidan con el término
        this.tickets = this.allTickets.filter(ticket => {
          return (
            (ticket.titulo && ticket.titulo.toLowerCase().includes(term)) ||
            (ticket.descripcion && ticket.descripcion.toLowerCase().includes(term)) ||
            (ticket.asignado_a && ticket.asignado_a.toLowerCase().includes(term)) ||
            (ticket.id.toString().includes(term))
          );
        });
      }

      this.updateTicketColumns();
      this.ordenarTickets();
    },
    async handleAttachmentUploaded() {
      if (this.selectedTicket && this.selectedTicket.id) {
        try {
          const response = await axios.get(`/api/ticket/${this.selectedTicket.id}`);
          const updatedTicketData = response.data;

          // Re-transform the ticket data similar to how it's done in openTicketFull
          // This ensures consistency and reactivity if selectedTicket is replaced.
          const transformedTicket = {
            id: updatedTicketData.id,
            title: updatedTicketData.titulo,
            description: updatedTicketData.descripcion,
            taskType: {
              name: updatedTicketData.categoria_nombre || 'Sin categoría',
              color: updatedTicketData.categoria_color_rgb || '#757575'
            },
            priority: {
              name: updatedTicketData.prioridad_nombre || 'Normal',
              color: this.getPriorityColor(updatedTicketData.prioridad_nivel) || (updatedTicketData.prioridad_color_hex || '#FFAB00')
            },
            image: updatedTicketData.imagen,
            date: updatedTicketData.fecha_creacion,
            assignee: `${updatedTicketData.asignado_nombre || ''} ${updatedTicketData.asignado_apellidos || ''}`.trim(),
            attachments: updatedTicketData.attachments || [],
            activityLog: [], // Or fetch if available
            currentUser: { name: "Tú", avatar: "" }, // Or use actual user data

            // Raw fields for editing, ensure these match what openTicketFull sets
            titulo: updatedTicketData.titulo,
            descripcion: updatedTicketData.descripcion,
            imagen: updatedTicketData.imagen,
            prioridad_id: updatedTicketData.prioridad_id,
            categoria_id: updatedTicketData.categoria_id,
            pauta_id: updatedTicketData.pauta_id,
            usuario_id: updatedTicketData.usuario_id,
            hora_inicio: updatedTicketData.hora_inicio,
            hora_final: updatedTicketData.hora_final,
            fecha_vencimiento: updatedTicketData.fecha_vencimiento
          };
          this.selectedTicket = transformedTicket; // Replace the object to ensure reactivity

          // Refresh the main list of tickets as well
          await this.fetchTickets();

        } catch (error) {
          console.error('Error re-fetching ticket details after upload:', error);
          // Optionally, inform the user that the view might not be up-to-date
        }
      }
    },
    ordenarTickets() {
      this.ticketColumns.forEach(column => {
        column.tickets.sort((a, b) => {
          if (this.orden === 'prioridad') {
            // Ordenar por prioridad_id DESCENDENTE (4 primero, luego 3, etc.)
            return b.prioridad_id - a.prioridad_id; // Cambiado a b - a
          } else {
            // Ordenar por fecha (se mantiene igual)
            const fechaA = new Date(a.fecha_vencimiento);
            const fechaB = new Date(b.fecha_vencimiento);

            if (this.orden === 'mayor') {
              return fechaB - fechaA;
            } else {
              return fechaA - fechaB;
            }
          }
        });
      });
    },
    updateTicketColumns() {
      this.ticketColumns.forEach(column => {
        column.tickets = this.tickets.filter(ticket => ticket.estado === column.state);
      });
    },
    async fetchTickets() {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await axios.post('http://localhost:3000/api/usuarios/getTickets', {
          id: usuario.id
        });
        this.allTickets = response.data;
        console.log(this.allTickets);
        this.tickets = [...this.allTickets]; // Copia inicial
        this.updateTicketColumns(); // Método nuevo para actualizar columnas
        this.ordenarTickets();
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    },
    toggleForm() { this.showForm = !this.showForm; },

    async openTicketFull(ticket) {
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
          color: this.getPriorityColor(ticket.nivel_prioridad)
        },
        image: ticket.imagen,
        date: ticket.fecha_creacion,
        assignee: `${ticket.asignado_nombre || ''} ${ticket.asignado_apellidos || ''}`.trim(),
        attachments: [], // will be filled by fetching detailed data
        activityLog: [],
        currentUser: { name: "Tú", avatar: "" },

        // Campos crudos necesarios para editar luego
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

      // Fetch attachments from the detailed ticket API
      try {
        const response = await axios.get(`/api/ticket/${ticket.id}`);
        transformedTicket.attachments = response.data.attachments || [];
      } catch (error) {
        console.error('Error fetching ticket attachments:', error);
      }
      this.selectedTicket = transformedTicket;
      this.showTicketFull = true;
    },
    closeTicketFull() {
      this.showTicketFull = false;
      this.selectedTicket = null;
    },
    getPriorityColor(nivel) {
      switch (nivel) {
        case 1: return '#42A5F5'; // Normal
        case 2: return '#FFA726'; // Baja
        case 3: return '#EF5350'; // Alta
        case 4: return '#D32F2F'; // Crítica
        default: return '#BDBDBD';
      }
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
      let usuario = JSON.parse(localStorage.getItem("usuario")); // convierte el string a objeto

      let id = usuario.id; // accedes al campo "id"
      axios
        .put(`/api/pautas/tickets/${ticket.id}`, { estado: ticket.estado, usuario: id })
        .then(() => {
          console.log('Ticket state updated successfully');
        })
        .catch((error) => {
          console.error('Error updating ticket state:', error);
        });
    },
  },
  mounted() {
    this.fetchTickets();
  }
};
</script>

<style scoped>
/* Importar Poppins */
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap'); */

.contenedor-horizontal {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  gap: 0;
  background-color: #f8f8fa;
  overflow: hidden;
}

.list-panel,
.detail-panel,
.tickets-panel {
  height: 100%;
  border-right: 1px solid #e0e0e0;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.tickets-panel {
  border-right: none;
  background-color: #F3F4F8;
}

/* Areas de scroll internas */
.list-scroll-area,
.detail-scroll-area,
.ticket-list

/* .ticket-list ahora tiene scroll */
  {
  overflow-y: auto;
  flex-grow: 1;
  flex-basis: 0;
}

/* Estilo scrollbar */
.list-scroll-area::-webkit-scrollbar,
.detail-scroll-area::-webkit-scrollbar,
.description-block::-webkit-scrollbar,
.ticket-columns-container::-webkit-scrollbar,
.ticket-list::-webkit-scrollbar {
  height: 6px;
  width: 5px;
}

.list-scroll-area::-webkit-scrollbar-track,
.detail-scroll-area::-webkit-scrollbar-track,
.description-block::-webkit-scrollbar-track,
.ticket-columns-container::-webkit-scrollbar-track,
.ticket-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.list-scroll-area::-webkit-scrollbar-thumb,
.detail-scroll-area::-webkit-scrollbar-thumb,
.description-block::-webkit-scrollbar-thumb,
.ticket-columns-container::-webkit-scrollbar-thumb,
.ticket-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.list-scroll-area::-webkit-scrollbar-thumb:hover,
.detail-scroll-area::-webkit-scrollbar-thumb:hover,
.description-block::-webkit-scrollbar-thumb:hover,
.ticket-columns-container::-webkit-scrollbar-thumb:hover,
.ticket-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}


/* Estilos lista pautas */
.pauta-list-item {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease-in-out;
}

.pauta-list-item:hover {
  background-color: #f5f5f5;
}

.list-item-title {
  font-size: 0.85rem;
  line-height: 1.3;
  white-space: normal;
  font-weight: 500;
}

.list-item-subtitle {
  font-size: 0.75rem;
  line-height: 1.2;
  white-space: normal;
  color: #757575;
}

.selected-pauta {
  background-color: #e3f2fd !important;
  border-left: 3px solid #1976D2;
}

.selected-pauta .list-item-title {
  font-weight: 700;
  color: #1976D2;
}

.list-scroll-area .v-list-item:last-child {
  border-bottom: none;
}

/* Estilos detalle pauta */
.description-block {
  background-color: #f5f5f5;
  border: 1px solid #eeeeee;
  max-height: 10rem;
  overflow-y: auto;
  position: relative;
}

.description-text {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  line-height: 1.6;
  color: #333;
  text-align: justify;
  hyphens: auto;
}

.footer-action {
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
  position: relative;
  z-index: 2;
}

.ticket-columns-container {
  display: flex;
  gap: 16px;
  height: 100%;
  align-content: center;
  overflow-x: auto;
  overflow-y: hidden;
  flex-grow: 1;
}

.ticket-column {
  flex: 0 0 220px;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.column-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
  background-color: #ffffff;
  border-radius: 8px
}

.column-title {
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.ticket-list {
  padding: 12px 8px;
}

.btnAddPauta {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  background-color: #B5179E;
  color: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

@media (max-width: 1280px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>

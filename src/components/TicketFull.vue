<template>
  <v-card class="ticket-detail-card rounded-xl elevation-4" :loading="!ticket">
    <template v-if="ticket">
      <div class="bars-container">
        <div class="task-type-bar d-flex align-center pl-2 pr-3" :style="{ backgroundColor: ticket.taskType?.color || '#757575' }">
          <span class="bar-text">{{ ticket.taskType?.name || "Tipo" }}</span>
        </div>
        <div class="priority-bar" :style="{ backgroundColor: ticket.priority?.color || '#FFAB00' }"></div>
      </div>

      <div class="card-actions">
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn icon variant="text" density="compact" color="grey-darken-1" v-bind="props">
              <v-icon size="small">mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="editarTicket">
              <v-list-item-title>Editar</v-list-item-title>
            </v-list-item>
            <v-list-item @click="eliminarTicket">
              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn icon variant="text" density="compact" color="grey-darken-1" @click="$emit('close-modal')">
          <v-icon size="small">mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="image-area-container">
        <v-img v-if="ticket.image" :src="`http://localhost:3000/uploads/${ticket.image}`" height="220px" cover class="main-image rounded-lg" />
        <div v-else class="image-placeholder"></div>
      </div>

      <v-card-text class="main-content-area pb-4">
        <div class="d-flex justify-space-between align-start mb-1">
          <div>
            <h1 class="text-h5 font-weight-bold mb-0">{{ ticket.title }}</h1>
            <p v-if="ticket.assignee" class="text-body-2 text-medium-emphasis mt-1">Como: {{ ticket.assignee }}</p>
          </div>
          <span class="text-caption text-blue-grey-darken-1 mt-1">{{ formatDate(ticket.date) }}</span>
        </div>

        <div class="section-container mt-5">
          <label class="section-label">Descripción</label>
          <div class="description-block pa-4 rounded-lg">
            <p class="section-content text-body-2 ma-0">{{ ticket.description }}</p>
          </div>
        </div>

        <div class="section-container mt-5">
          <div class="d-flex justify-space-between align-center mb-3">
            <label class="section-label">Adjuntos del creativo</label>
            <v-btn variant="text" size="small" density="compact" prepend-icon="mdi-paperclip" color="grey-darken-2">
              Adjuntos
            </v-btn>
          </div>
          <div class="attachments-list">
            <v-chip v-for="(file, index) in ticket.attachments" :key="index" label size="small" class="mr-2 mb-2 attachment-chip" :prepend-icon="getAttachmentIcon(file.type)">
              {{ file.name }}
            </v-chip>
          </div>
        </div>

        <v-divider class="my-5" />

        <div class="section-container">
          <label class="section-label mb-4">Actividad</label>
          <div class="activity-feed">
            <div v-for="(comment, index) in comentarios" :key="index" class="activity-item d-flex align-start mb-4">
              <v-avatar size="32" class="mr-3 flex-shrink-0" :style="{ backgroundColor: generateColorFromString(comment.nombre + comment.apellidos) }">
                <span class="white--text text-subtitle-2 font-weight-medium">{{ getIniciales(comment.nombre, comment.apellidos) }}</span>
              </v-avatar>
              <div class="activity-content">
                <span class="font-weight-bold text-body-2 user-name">{{ comment.nombre }}</span>
                <span class="text-body-2 text-medium-emphasis action-text">{{ comment.contenido }}</span>
                <p class="text-caption text-disabled timestamp">{{ formatTimestamp(comment.fecha_creacion) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="comment-section d-flex align-center mt-5 pa-2">
          <v-avatar size="36" class="mr-3">
            <v-img v-if="ticket.currentUser?.avatar" :src="ticket.currentUser?.avatar" :alt="ticket.currentUser?.name" cover />
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-avatar>
          <v-text-field
            v-model="nuevoComentario"
            variant="filled"
            bg-color="grey-lighten-4"
            placeholder="Escribe un comentario..."
            density="compact"
            hide-details
            rounded
            flat
          />
          <v-btn icon variant="text" size="small" class="ml-1" color="primary" @click="enviarComentario">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </template>

    <div v-else class="d-flex justify-center align-center" style="height: 400px;">
      <v-progress-circular indeterminate color="primary" />
    </div>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  name: "TicketDetailModal",
  props: { ticket: { type: Object, default: null } },
  emits: ["close-modal", "editar-ticket", "eliminar-ticket"],
  data() {
    return {
      nuevoComentario: '',
      comentarios: [],
      usuarioLogueado: null
    };
  },
  watch: {
    'ticket.id': {
      immediate: true,
      handler(newId) {
        if (newId) this.cargarComentarios(newId);
      }
    }
  },
  mounted() {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      this.usuarioLogueado = JSON.parse(stored);
    }
    if (this.ticket?.id) {
      this.cargarComentarios(this.ticket.id);
    }
  },
  methods: {
    editarTicket() {
      this.$emit('editar-ticket', this.ticket);
    },
    eliminarTicket() {
      if (confirm('¿Estás seguro de que deseas eliminar este ticket?')) {
        this.$emit('eliminar-ticket', this.ticket.id);
      }
    },
    getIniciales(nombre, apellidos) {
      return (nombre?.charAt(0).toUpperCase() || '') + (apellidos?.charAt(0).toUpperCase() || '');
    },
    generateColorFromString(input) {
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash % 360);
      return `hsl(${hue}, 70%, 75%)`;
    },
    async cargarComentarios(ticketId) {
      try {
        const res = await axios.get(`/api/comentarios/${ticketId}`);
        this.comentarios = res.data;
      } catch (err) {
        console.error('Error al cargar comentarios:', err);
      }
    },
    async enviarComentario() {
      if (!this.nuevoComentario.trim()) return;
      try {
        const payload = {
          ticket_id: this.ticket.id,
          usuario_id: this.usuarioLogueado?.id,
          contenido: this.nuevoComentario
        };
        const res = await axios.post('/api/comentarios', payload);
        this.comentarios.push({
          ...res.data,
          nombre: `${this.usuarioLogueado.nombre} ${this.usuarioLogueado.apellido}`,
          avatar: this.usuarioLogueado.avatar || ''
        });
        this.nuevoComentario = '';
      } catch (err) {
        console.error('Error al enviar comentario:', err);
      }
    },
    formatDate(dateString) {
      try {
        return new Date(dateString).toLocaleDateString("es-ES", {
          day: "numeric", month: "short", year: "numeric"
        }).replace('.', '');
      } catch {
        return dateString;
      }
    },
    formatTimestamp(timestamp) {
      const now = new Date();
      const past = new Date(timestamp);
      const diff = now.getTime() - past.getTime();
      const minutes = Math.round(diff / (1000 * 60));
      if (minutes < 1) return 'Ahora mismo';
      if (minutes < 60) return `Hace ${minutes} min`;
      const hours = Math.round(minutes / 60);
      if (hours < 24) return `Hace ${hours} h`;
      const days = Math.round(hours / 24);
      return days === 1 ? 'Ayer' : `Hace ${days} días`;
    },
    getAttachmentIcon(fileType) {
      if (!fileType) return "mdi-file-outline";
      const type = fileType.toLowerCase();
      if (type.startsWith("image")) return "mdi-image-outline";
      if (type === "pdf") return "mdi-file-pdf-box";
      if (type.includes("document") || type.includes("word")) return "mdi-file-word-outline";
      if (type.includes("sheet") || type.includes("excel")) return "mdi-file-excel-outline";
      if (type.includes("presentation") || type.includes("powerpoint")) return "mdi-file-powerpoint-outline";
      return "mdi-file-document-outline";
    }
  }
};
</script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  .ticket-detail-card {
    position: relative;
    font-family: 'Poppins', sans-serif;
    background-color: #ffffff;
  }

  .bars-container {
      position: absolute; top: 0; left: 0; right: 0;
      height: 60px; pointer-events: none;
      padding: 16px 24px 0 24px; /* Ajustado padding horizontal */
      z-index: 1;
  }

  .task-type-bar {
    position: absolute; top: 16px; left: 24px; /* Dentro del padding */
    height: 28px; border-radius: 14px; padding: 0 12px 0 10px;
    display: flex; align-items: center; pointer-events: auto;
  }

  .priority-bar {
    position: absolute; top: 16px; right: 100px; /* Dentro del padding derecho */
    width: 100px; height: 18px; border-radius: 20px; pointer-events: auto;
  }

  .bar-text {
      color: white; font-size: 10px; font-weight: 600; /* Más bold */
      text-transform: uppercase; letter-spacing: 0.6px; white-space: nowrap;
  }

  .card-actions {
    position: absolute; top: 12px; right: 16px; /* Más cerca del borde */
    z-index: 10; display: flex; gap: 0px; /* Sin gap extra */
  }
  .card-actions .v-btn { /* Botones un poco más oscuros */
      color: #5f6368 !important;
  }


  .image-area-container { margin-top: 60px; }
  .main-image { border-radius: 12px !important; /* Bordes más redondeados para la imagen */ }
  .image-placeholder { height: 0px; }

  .main-content-area { padding: 20px 24px 24px 24px !important; }

  .text-h5 { color: #1E293B; line-height: 1.3; }
  .text-body-2.text-medium-emphasis { color: #64748B; }
  .text-caption.text-blue-grey-darken-1 { color: #546E7A; font-size: 11px !important; }

  .section-container { margin-bottom: 1.75rem; }
  .section-label {
    font-size: 11px; /* Ligeramente más grande */
    font-weight: 600; color: #475569; /* Más oscuro */
    text-transform: uppercase; letter-spacing: 0.8px;
    display: block; margin-bottom: 0.75rem;
  }

  /* Bloque descripción con fondo */
  .description-block {
    background-color: #F1F5F9; /* slate-100 */
    border: none; /* Sin borde */
    /* padding ya viene de la clase pa-4 */
    /* border-radius ya viene de rounded-lg */
  }
  .section-content {
    color: #334155; line-height: 1.65; font-size: 13px;
  }

  /* Adjuntos */
  .attachments-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .attachment-chip {
      /* Estilo "morado-rosa" - ajusta el color exacto si es necesario */
      background-color: #F3E5F5 !important; /* purple-lighten-5 */
      color: #6A1B9A !important; /* purple-darken-3 */
      font-size: 11px !important; /* Un poco más pequeño */
      font-weight: 500;
      border-radius: 12px !important; /* Más redondeado */
      height: 26px !important; /* Ligeramente más alto */
  }
  .attachment-chip :deep(.v-icon) {
      color: #8E24AA !important; /* purple-darken-1 */
      font-size: 15px !important;
      margin-right: 5px !important;
      margin-left: -2px !important;
  }
  .v-btn--text { color: #475569; font-size: 12px; font-weight: 500; letter-spacing: normal; }
  .v-btn--text .v-icon { color: #64748B; font-size: 18px; }

  /* Actividad */
  .activity-item .user-name {
      color: #1E293B; font-size: 13px; font-weight: 600 !important; /* Bold */
  }
  .activity-item .action-text { font-size: 13px; color: #64748B; margin-left: 4px; }
  .activity-item .timestamp { font-size: 10px; color: #94A3B8; margin-top: 3px; }

  /* Comentario */
  .comment-section { background-color: #F8FAFC; border-radius: 16px; }
  .comment-section .v-text-field { padding-right: 4px; } /* Espacio antes del botón send */
  .comment-section .v-text-field :deep(.v-field) { box-shadow: none !important; background-color: transparent !important; }
  .comment-section .v-text-field :deep(input) { font-size: 13px; }


  .v-divider { border-color: #E2E8F0 !important; }
  </style>
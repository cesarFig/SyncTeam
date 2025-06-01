<template>
  <v-container fluid class="pa-0 notificaciones-view-container">
    <v-card flat color="#F3F4F8"> <!-- Added color="#F3F4F8" to v-card -->
      <v-card-title class="text-h5 pa-4 grey lighten-3">
        Bandeja de entrada
      </v-card-title>

      <v-list v-if="notifications.length > 0" style="background-color: transparent;"> <!-- Ensure v-list is transparent -->
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          class="py-2"
          :class="{
            'bg-white': notification.favorite, // Favorite items will be white
            'text-grey-darken-2': !notification.unread
          }"
        >
          <v-row align="center" class="w-100">
            <!-- Avatar -->
            <v-col cols="auto" class="d-flex align-center">
              <v-avatar color="grey" size="40" class="mr-2">
                <v-img
                  v-if="notification.avatar"
                  :src="notification.avatar"
                  cover
                />
                <span v-else class="white--text">{{ getInitials(notification.sender) }}</span>
              </v-avatar>
            </v-col>

            <!-- Contenido -->
            <v-col class="d-flex" cols="">
              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">
                  {{ notification.sender }}
                </v-list-item-title>
                <v-list-item-subtitle class="font-weight-bold">
                  {{ notification.title }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="text--secondary">
                  {{ notification.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-col>

            <!-- Hora -->
            <v-col cols="auto" class="d-flex align-center">
              <div class="text-caption text-right">
                {{ formatTime(notification.timestamp) }}
              </div>
            </v-col>

            <!-- Botón Leído -->
            <v-col cols="auto">
              <v-icon
                small
                :color="!notification.unread ? 'green' : 'grey lighten-1'"
                class="ml-2"
                @click.stop="toggleLeido(notification)"
              >
                {{ !notification.unread ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
            </v-col>

            <!-- Botón Eliminar -->
            <v-col cols="auto">
              <v-btn icon size="small" color="red" @click.stop="eliminarNotificacion(notification)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>

      <div v-else class="d-flex flex-column align-center justify-center py-12">
        <v-icon size="64" color="grey lighten-1">mdi-bell-off-outline</v-icon>
        <div class="text-subtitle-1 mt-2 text-grey-darken-1">
          No tiene ninguna notificación
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'NotificationsPanel',
  data() {
    return {
      notifications: []
    };
  },
  mounted() {
    this.cargarNotificaciones();
  },
  methods: {
    async cargarNotificaciones() {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const res = await fetch(`http://localhost:3000/api/notificaciones/${usuario.id}`);
        const data = await res.json();

        // Procesamiento y filtrado
        this.notifications = data
          .map(n => {
            const tipoBase = this.determinarTipo(n.tipo_notificacion, n.mensaje);
            return {
              id: n.id,
              sender: `${n.sender_nombre} ${n.sender_apellidos}`,
              avatar: n.emisor_avatar ? `http://localhost:3000/uploads/${n.emisor_avatar}` : null,
              title: n.tipo_notificacion,
              description: n.mensaje,
              timestamp: n.fecha_creacion,
              unread: !n.is_read,
              favorite: false,
              tipoBase
            };
          })
          .filter(n => {
            if (n.tipoBase === 'comentarios') return usuario.noti_comentarios;
            if (n.tipoBase === 'en_progreso') return usuario.noti_en_progreso;
            if (n.tipoBase === 'en_revision') return usuario.noti_en_revision;
            if (n.tipoBase === 'terminado') return usuario.noti_terminado;
            return true;
          });

      } catch (err) {
        console.error('Error cargando notificaciones:', err);
      }
    },

    determinarTipo(tipoNoti, mensaje) {
      const tipoLower = tipoNoti.toLowerCase();
      if (tipoLower.includes('comentario')) return 'comentarios';
      if (tipoLower.includes('estado')) {
        const msg = mensaje.toLowerCase();
        if (msg.includes('en progreso')) return 'en_progreso';
        if (msg.includes('revision')) return 'en_revision';
        if (msg.includes('terminado')) return 'terminado';
      }
      return 'otros';
    },

    getInitials(name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    },

    async toggleLeido(notification) {
      try {
        const nuevoEstado = notification.unread ? false : true;
        await fetch(`http://localhost:3000/api/notificaciones/read/${notification.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_read: !nuevoEstado })
        });
        notification.unread = nuevoEstado;
      } catch (err) {
        console.error("Error al actualizar leído/no leído:", err);
      }
    },

    async eliminarNotificacion(notification) {
      try {
        await fetch(`http://localhost:3000/api/notificaciones/${notification.id}`, {
          method: 'DELETE'
        });
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      } catch (err) {
        console.error("Error al eliminar notificación:", err);
      }
    }
  }
};
</script>

<style scoped>
.notificaciones-view-container {
  background-color: #F3F4F8;
  min-height: 100vh; 
}

.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>

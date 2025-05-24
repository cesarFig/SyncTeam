<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h5 pa-4 grey lighten-3">
        Bandeja de entrada
      </v-card-title>
      <v-list>
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          class="py-2"
          :class="{
            'bg-white': notification.favorite,
            'text-grey-darken-2': !notification.unread
          }"
          @click="marcarComoLeida(notification)"
        >
          <v-row align="center" class="w-100">
            <!-- Botones de seleccionar y favoritos -->
            <v-col cols="auto" class="d-flex">
              <v-checkbox 
                v-model="notification.selected" 
                color="primary" 
                @change="updateStatus(notification)"
              ></v-checkbox>
              <v-btn icon @click.stop="toggleFavorite(notification)" ripple="false">
                <v-icon :color="notification.favorite ? 'amber' : 'grey lighten-2'">
                  mdi-star
                </v-icon>
              </v-btn>
            </v-col>

            <!-- Avatar del usuario -->
            <v-col cols="auto" class="d-flex align-center">
              <v-avatar color="grey" size="40" class="mr-2">
                <v-img v-if="notification.avatar" :src="notification.avatar" cover></v-img>
                <span v-else class="white--text">{{ getInitials(notification.sender) }}</span>
              </v-avatar>
            </v-col>

            <!-- Contenido de la notificación -->
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

            <!-- Timestamp -->
            <v-col cols="auto" class="d-flex align-center">
              <div class="text-caption text-right">
                {{ formatTime(notification.timestamp) }}
              </div>
            </v-col>

            <!-- Estado -->
            <v-col cols="auto">
              <v-icon 
               small 
  :color="!notification.unread ? 'green' : 'grey lighten-1'" 
  class="ml-2"
>
  {{ !notification.unread ? 'mdi-check-circle' : 'mdi-circle-outline' }}

              </v-icon>
            </v-col>

            <!-- Botón eliminar -->
            <v-col cols="auto">
              <v-btn icon size="small" color="red" @click.stop="eliminarNotificacion(notification)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
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
  },mounted() {
  this.cargarNotificaciones();
},
  methods: {
	async cargarNotificaciones() {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const res = await fetch(`http://localhost:3000/api/notificaciones/${usuario.id}`);
      const data = await res.json();
      this.notifications = data.map(n => ({
        id: n.id,
        sender: `${n.sender_nombre} ${n.sender_apellidos}`,
        title: n.tipo_notificacion,
        description: n.mensaje,
        timestamp: n.fecha_creacion,
        unread: !n.is_read,
        favorite: false,
        selected: false,
        status: 'pending', // o cambia si tienes lógica adicional
        type: 'comentario' // si quieres tipificar
      }));
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
    }
  },
    toggleFavorite(notification) {
      notification.favorite = !notification.favorite;
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
    updateStatus(notification) {
      notification.status = notification.selected ? 'approved' : 'pending';
    },
    markAsRead(notification) {
      notification.unread = false;
    },async marcarComoLeida(notification) {
    try {
      await fetch(`http://localhost:3000/api/notificaciones/read/${notification.id}`, {
        method: 'PUT'
      });
      notification.unread = false;
    } catch (err) {
      console.error("Error al marcar como leída:", err);
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
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>

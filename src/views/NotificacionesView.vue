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
              //'bg-pink lighten-4': !notification.favorite && notification.selected
            }"
          >
            <v-row align="center" class="w-100">
              <!-- Botones de seleccionar y favoritos -->
              <v-col cols="auto" class="d-flex">
                <v-checkbox 
                  v-model="notification.selected" 
                  color="primary" 
                  @change="updateStatus(notification)"
                ></v-checkbox>
                <v-btn icon @click="toggleFavorite(notification)" ripple="false">
                  <v-icon :color="notification.favorite ? 'amber' : 'grey lighten-2'">
                    mdi-star
                  </v-icon>
                </v-btn>
              </v-col>
  
              <!-- Foto del creativo -->
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
  
              <!-- Estado de la notificación -->
              <v-col cols="auto">
                <v-icon 
                  small 
                  :color="notification.status === 'approved' ? 'green' : 'primary'" 
                  class="ml-2"
                >
                  {{ notification.status === 'approved' ? 'mdi-check-circle' : 'mdi-circle' }}
                </v-icon>
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
        notifications: [
          {
            id: 1,
            sender: 'Cesar Figueroa',
            title: 'Modificar ticket 8',
            description: 'Revise los comentarios a modificar en el ticket.',
            timestamp: '2023-06-15T08:43:00',
            unread: true,
            favorite: false,
            selected: false,
            status: 'pending',
            type: 'assignment'
          },
          {
            id: 2,
            sender: 'Armando Casanova',
            title: 'Revisión ticket 5',
            description: 'Su ticket está en proceso de revisión.',
            timestamp: '2023-06-15T07:16:00',
            unread: true,
            favorite: false,
            selected: false,
            status: 'in-review',
            type: 'status-change'
          },
          {
            id: 3,
            sender: 'Eduardo Rodríguez',
            title: 'Aprobación ticket 13',
            description: 'Su ticket ha sido aprobado. ¡Buen trabajo!',
            timestamp: '2023-06-15T04:16:00',
            unread: false,
            favorite: true,
            selected: false,
            status: 'approved',
            type: 'approved'
          },
          {
            id: 4,
            sender: 'Cesar Figueroa',
            title: 'Nuevo ticket asignado',
            description: 'Se te ha asignado un nuevo ticket.',
            timestamp: '2023-06-15T03:15:00',
            unread: false,
            favorite: false,
            selected: false,
            status: 'pending',
            type: 'assignment'
          },
          {
            id: 5,
            sender: 'Mirali Rodríguez',
            title: 'Modificar ticket 23',
            description: 'Revise los comentarios a modificar en el ticket.',
            timestamp: '2023-06-15T11:16:00',
            unread: true,
            favorite: true,
            selected: false,
            status: 'pending',
            type: 'comment'
          },
          {
            id: 6,
            sender: 'Mirali Rodríguez',
            title: 'Aprobación ticket 3',
            description: 'Su ticket ha sido aprobado. ¡Buen trabajo!',
            timestamp: '2023-06-15T08:38:00',
            unread: false,
            favorite: true,
            selected: false,
            status: 'approved',
            type: 'approved'
          }
        ]
      };
    },
    methods: {
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
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // convierte 0 a 12
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
},
      updateStatus(notification) {
        // Cambiar el estado de la notificación al marcarla como seleccionada
        notification.status = notification.selected ? 'approved' : 'pending';
      },
      markAsRead(notification) {
        notification.unread = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .v-list-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  </style>
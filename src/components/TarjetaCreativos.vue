<template>
  <v-container fluid class="d-flex justify-center align-center fill-height">
    <v-card class="user-card">
      <!-- Encabezado con avatar, nombre y rol -->
      <v-card-title class="d-flex align-center">
        <!-- Avatar circular -->
        <v-avatar size="40" color="deep-purple lighten-3">
          <v-img
            v-if="usuario.avatar"
            :src="getAvatarUrl(usuario.avatar)"
            cover
          />
          <span
            v-else
            class="white--text text-subtitle-2"
          >
            {{ getInitials(usuario.nombre + ' ' + usuario.apellidos) }}
          </span>
        </v-avatar>

        <!-- Nombre y rol -->
        <div class="user-info ml-3">
          <h3 class="name">{{ usuario.nombre + " " + usuario.apellidos }}</h3>
          <p class="role">{{ rol }}</p>
        </div>
      </v-card-title>

      <!-- Correo sin borde -->
      <v-card-text class="email-box">
        {{ usuario.email }}
      </v-card-text>

      <!-- Información de tickets -->
      <v-card-actions class="footer">
        <div class="ticket-info">
          <span>{{ tickets.ticketsTotales }} Tickets Totales</span>
        </div>
        <span class="active-tickets"><b>Activos:</b> {{ tickets.ticketsActivos }}</span>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tickets: [],
      rol: ''
    };
  },
  props: {
    usuario: {
      type: Object
    }
  },
  mounted() {
    this.getTicketsUser();
  },
  methods: {
    getInitials(nombreCompleto) {
      if (!nombreCompleto) return '';
      const partes = nombreCompleto.trim().split(' ');
      return partes.map(p => p[0]?.toUpperCase()).join('').slice(0, 2);
    },
    getAvatarUrl(nombreArchivo) {
      return `http://localhost:3000/uploads/${nombreArchivo}`;
    },
    async getTicketsUser() {
      try {
        const response = await axios.post('http://localhost:3000/api/usuarios/getTicket', {
          id: this.usuario.id
        });
        this.tickets = response.data;

        switch (this.usuario.rol_id) {
          case 1: this.rol = 'Administrador'; break;
          case 2: this.rol = 'Copywriter'; break;
          case 3: this.rol = 'Editor'; break;
          case 4: this.rol = 'Fotógrafo'; break;
          case 5: this.rol = 'Publicador'; break;
          case 6: this.rol = 'Diseñador'; break;
          case 7: this.rol = 'Cliente'; break;
        }
      } catch (error) {
        console.error('Error al cargar tickets:', error);
      }
    }
  }
};
</script>


<style scoped>
.user-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 270px !important;
  height: 170px !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Nombre y rol */
.user-info .name {
  font-size: 1rem;
  text-align: left;
  margin: 0;
  font-weight: 600;
  white-space: nowrap;
}

.role {
  color: #b5179f;
  font-size: 0.85rem;
  margin-top: 2px;
  text-align: left;
  white-space: nowrap;
}

/* Correo */
.email-box {
  background: #f4f4f4;
  border-radius: 10px;
  padding: 7px;
  font-size: 0.85rem;
  color: #666;
  text-align: left;
  margin: 4px;
}

/* Footer bien alineado */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 4px 5px;
}

.ticket-info {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  white-space: nowrap;
  gap: 6px;
}

.active-tickets {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  text-align: right;
}

/* Responsivo */
@media (max-width: 400px) {
  .user-card {
    width: 90%;
  }

  .footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .active-tickets {
    margin-top: 5px;
  }
}
</style>

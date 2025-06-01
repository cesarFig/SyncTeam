<template>
  <v-container class="equipo-view-container">
    <!-- Barra de búsqueda y filtros -->
    <v-row class="mb-4" justify="end">
      <v-col cols="6" md="4">
        <v-text-field
          v-model="searchTerm"
          label="Buscar creativos..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          @update:modelValue="handleSearch"
        />
      </v-col>
      
      <v-col cols="6" md="4" class="text-right">
        <v-select
          v-model="filtroRol"
          :items="rolesOptions"
          item-title="text"
          item-value="value"
          label="Filtrar por rol"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          style="min-width: 200px"
        />
      </v-col>
    </v-row>

    <!-- Secciones de creativos por rol -->
    <template v-for="rol in rolesFiltrados" :key="rol.id">
      <h2 class="section-title">{{ rol.nombre }}</h2>
      <v-row>
        <v-col 
          v-for="creativo in creativosFiltrados.filter(c => c.rol_id === rol.id)" 
          :key="creativo.id" 
          cols="12" sm="6" md="4" lg="3"
        >
          <UserCard :usuario="creativo" />
        </v-col>
      </v-row>
    </template>

    <!-- Todos los creativos -->
    
    <v-btn @click="irADestino" variant="outlined" class="btnAddPauta">
      Nuevo miembro
    </v-btn>
  </v-container>
</template>

<script>
import UserCard from '@/components/TarjetaCreativos.vue';
import axios from 'axios';

export default {
  components: {
    UserCard
  },
  data() {
    return {
      creativos: [],
      allCreativos: [], // Copia completa para filtrado
      searchTerm: '',
      filtroRol: null,
      roles: [
        { id: 1, nombre: 'Administrador' },
        { id: 2, nombre: 'Copywriter' },
        { id: 3, nombre: 'Editor' },
        { id: 4, nombre: 'Fotógrafo' },
        { id: 5, nombre: 'Publicador' },
        { id: 6, nombre: 'Diseñador' }
      ],
      rolesOptions: [
        { text: 'Administrador', value: 1 },
        { text: 'Copywriter', value: 2 },
        { text: 'Editor', value: 3 },
        { text: 'Fotógrafo', value: 4 },
        { text: 'Publicador', value: 5 },
        { text: 'Diseñador', value: 6 }
      ]
    };
  },
  computed: {
    rolesFiltrados() {
      // Mostrar solo roles que tengan creativos en los resultados filtrados
      return this.roles.filter(rol => 
        this.creativosFiltrados.some(c => c.rol_id === rol.id)
      );
    },
    creativosFiltrados() {
      let filtered = this.allCreativos;
      
      // Aplicar filtro de rol si está seleccionado
      if (this.filtroRol) {
        filtered = filtered.filter(c => c.rol_id === this.filtroRol);
      }
      
      // Aplicar búsqueda si hay término
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(c => 
          (c.nombre && c.nombre.toLowerCase().includes(term)) ||
          (c.email && c.email.toLowerCase().includes(term)) ||
          (c.rol && c.rol.toLowerCase().includes(term))
        );
      }
      
      return filtered;
    }
  },
  mounted() {
    this.getUsuarios();
  },
  methods: {
    irADestino() {
      this.$router.push('/registro');
    },
    async getUsuarios() {
      try {
        const response = await axios.get('http://localhost:3000/api/usuarios/getUsuarios');
        this.creativos = response.data;
        this.allCreativos = [...response.data]; // Guardar copia completa
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    },
    handleSearch() {
      // El filtrado se maneja automáticamente con la propiedad computada
    }
  }
};
</script>

<style scoped>
.equipo-view-container {
  background-color: #F3F4F8;
  min-height: 100vh; /* Ensure it covers the full view height */
}

.section-title {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 2px solid #b5179f;
  margin-top: 20px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .section-title {
    font-size: 1.3rem;
  }
}

.btnAddPauta {
  position: fixed;
  bottom: 80px;
  right: 40px;
  z-index: 999;
  background-color: #B5179E;
  color: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Estilos para los campos de búsqueda y filtro */
.v-text-field, .v-select {
  margin-top: 8px;
}

@media (max-width: 960px) {
  .v-col.text-right {
    text-align: left !important;
  }
}
</style>
<template>
  <div class="background">
    <v-dialog v-model="showForm" max-width="500">
      <FormPauta 
        @close="toggleForm" 
        @save="handleSavePauta" 
      />
    </v-dialog>
    <v-row class="mt-5 ml-3" align="center" justify="space-between">
      <v-col cols="20" sm="13" md="4">
        <v-text-field
          density="compact"
          variant="outlined"
          v-model="nombre"
          class="buscador-field"
          label="Buscar pauta"      
        /> 
      </v-col>
      <v-col cols="6" sm="6" md="2">
        <v-text-field
          density="compact"
          variant="outlined"
          v-model="categoria"
          class="categoria-field"
          label="Categoría"      
        />
      </v-col>
      <v-col cols="6" sm="6" md="2">
        <v-text-field
          density="compact"
          variant="outlined"
          v-model="orden"
          class="Ordenar-field"
          label="Ordenar por:"
        />
      </v-col>
    </v-row>
    <h1>Pautas</h1>
    <v-btn @click="toggleForm" variant="outlined" class="btnAddPauta">Nueva pauta</v-btn>
    <div class="card-grid">
      <TaskCard
        v-for="(task, index) in tasks"
        :key="index"
        :image="task.image"
        :title="task.title"
        :tickets="task.tickets"
        :progress="task.progress"
        :remainingDays="task.remainingDays"
        :users="task.users"
        :prioridad_color="task.prioridad_color"
        @click="goToPauta(task)" />
    </div>
  </div>
</template>

<script>
import FormPauta from '../components/forms/FormPauta.vue';
import TaskCard from '../components/CardPauta.vue';
import axios from 'axios';
import defaultImage from '@/assets/default-image.png';
// eslint-disable-next-line
import { useRouter } from 'vue-router';

export default {
  components: { TaskCard, FormPauta },
  data() {
    return {
      showForm: false,
      tasks: [] 
    };
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async fetchPautas() {
      try {
        const response = await axios.get('api/pautas'); 
        this.tasks = response.data.map(pauta => ({
          id: pauta.id,
          image: pauta.imagen && pauta.imagen.trim() ? pauta.imagen : defaultImage, 
          title: pauta.titulo,
          tickets: pauta.total_tickets,
          progress: Math.round((pauta.tickets_completados / pauta.total_tickets) * 100) || 0, // Redondear el porcentaje
          remainingDays: pauta.dias_restantes,
          prioridad: pauta.prioridad_id,
          prioridad_color: pauta.prioridad_color
        }));
      } catch (error) {
        console.error('Error fetching pautas:', error);
      }
    },
    goToPauta(task) {
      this.$router.push({ path: '/tickets-pautas', query: { id: task.id } });
    }
  },
  mounted() {
    this.fetchPautas();
  }
};
</script>

<style>
.background {
  height: 100%; width: 100%;
  gap: 0; background-color: #f8f8fa; overflow: hidden;
}
.btnAddPauta{
  position: fixed;
  bottom: 80px;
  right: 40px;
  z-index: 999;
  background-color: #B5179E;
  color: white;
  border-radius: 15px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  justify-items: center;
}
.card-grid > * {
  cursor: pointer; 
}
.card-grid TaskCard img {
  width: 300px;
  height: 120px;
  object-fit: cover;
}
.buscador-field{
  margin-left: 1vw;
}
.categoria-field{
      margin-left: 100% !important;
      margin-right: -100% !important;
}
.Ordenar-field{
      margin-left: -10% !important;
      margin-right: 20% !important;    
}

@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .categoria-field{
      margin-left: 0% !important;
      margin-right: 0% !important;
  }  
  .Ordenar-field{
      margin-left: 0% !important;
      margin-right: 0% !important;    
  }
  .buscador-field{
    margin-left: 0vw;
  }
}

@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
  h1{
      margin-left: 6vw !important;
  }
}
h1{
  margin-left: 3vw;
}

</style>

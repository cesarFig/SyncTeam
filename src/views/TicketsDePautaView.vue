<template>
  <v-dialog v-model="showForm" max-width="500">
    <FormPauta @close="toggleForm" @save="handleSavePauta" />
  </v-dialog>

  <div class="contenedor-horizontal">


    <!-- Listado de Pautas -->
    <v-card class="pa-4 mr-2" height="calc(100vh - 180px)" style="overflow-y: auto;">
      <h2 class="text-h5 mb-4">Pautas</h2>

      <v-list lines="two">
        <v-list-item v-for="(pauta, index) in filteredPautas" :key="index" :title="pauta.titulo"
          :subtitle="pauta.subtitulo" @click="selectPauta(pauta)"
          :class="{ 'bg-grey-lighten-3': selectedPauta?.id === pauta.id }">
          <template v-slot:prepend>
            <v-icon icon="mdi-file-document-outline" class="mr-2"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>


    <!-- Descripción de Pauta -->
    <v-card class="pa-4" style="overflow-y: auto;" v-if="selectedPauta">
      <h2 class="text-h5 mb-2">{{ selectedPauta.titulo }}</h2>
      <h3 class="text-subtitle-1 mb-4">Cliente: {{ selectedPauta.cliente }}</h3>

      <v-card variant="outlined" class="pa-3 mb-4">
        <h4 class="text-subtitle-2 mb-2">Descripción</h4>
        <p>{{ selectedPauta.descripcion }}</p>
      </v-card>

      <div class="mb-4">
        <h4 class="text-subtitle-2 mb-2">Prioridad</h4>
        <v-table density="compact">
          <tbody>
            <tr>
              <td><strong>Otaya</strong></td>
              <td><strong>Temmirado</strong></td>
            </tr>
            <tr>
              <td>Crear descripción</td>
              <td>Recuperar</td>
            </tr>
            <tr>
              <td colspan="2">Redacta los otaya para la publicita..</td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <div class="mb-4">
        <h4 class="text-subtitle-2 mb-2">Fato de producto</h4>
        <p>Tomar fotografías de los productos</p>
        <p class="text-caption text-grey">[Aug 20, 2025]</p>
      </div>

      <div>
        <h4 class="text-subtitle-2 mb-2">Colaboradores</h4>
        <v-chip-group>
          <v-chip v-for="(colab, i) in selectedPauta.colaboradores" :key="i" size="small">
            {{ colab }}
          </v-chip>
        </v-chip-group>
        <p class="text-caption text-grey mt-2">[8 Abril 2025]</p>
      </div>
    </v-card>

    <v-card v-else class="pa-4 d-flex align-center justify-center" height="calc(100vh - 180px)">
      <p class="text-grey">Seleccione una pauta para ver los detalles</p>
    </v-card>
    <div>
    <!-- Tickets de Pauta -->
  <v-card class="pa-4 ml-2" height="calc(100vh - 180px)" style="overflow-y: auto;">
    <h1 class="text-h5 mb-4">Tickets de pauta</h1>
    <div class="card-grid">
      <TicketCard v-for="(task, index) in tasks" :key="index" :image="task.image" :title="task.title"
        :ticketNum="task.ticketNum" :progress="task.progress" :remainingDays="task.remainingDays" :users="task.users" />
    </div>
  </v-card>

  <v-btn @click="toggleForm" variant="outlined" class="btnAddPauta">Nueva pauta</v-btn>
  </div>
  </div>
    
  
</template>

<script>
/* eslint-disable */
import FormPauta from '../components/forms/FormPauta.vue';
import TicketCard from '../components/CardTicket.vue';
import imagenAdidas from '@/assets/imagenAdidas.png';

export default {
  components: { TicketCard, FormPauta },
  data() {
    return {
      showForm: false,
      nombre: '',
      categoria: '',
      orden: '',
      selectedPauta: null,
      pautas: [
        {
          id: 1,
          titulo: 'Polificación MenáíCalves',
          subtitulo: 'Edición Barreter III. Medipaga.',
          cliente: 'Pastelería MeraliCakes',
          descripcion: 'Desde y preguntar una publicación simultánquica. Establece el programa de la Ley de Protección en materia de protección, que se encuentra en el plano de protección del sector público.',
          colaboradores: ['Cesar Figueroa', 'Meral Rodríguez'],
          fecha: 'Aug 20, 2025'
        },
        {
          id: 2,
          titulo: 'Publicación semanal MeraliCakes',
          subtitulo: 'Conexión de 3 historias por..',
          cliente: 'Pastelería MeraliCakes',
          descripcion: 'Redacción de un artículo para la publicación semanal de MeraliCakes con enfoque en nuevos productos.',
          colaboradores: ['Ana López', 'Juan Pérez'],
          fecha: 'Aug 18, 2025'
        },
        {
          id: 3,
          titulo: 'Escalón fotográfica',
          subtitulo: 'Edita la sesión fotográfica para lla..',
          cliente: 'Pastelería MeraliCakes',
          descripcion: 'Edición profesional de la sesión fotográfica de productos para catálogo.',
          colaboradores: ['Meral Rodríguez', 'Carlos Sánchez'],
          fecha: 'Aug 20, 2021'
        }
      ],
      tasks: [
        {
          image: imagenAdidas,
          title: 'Promo Adidas Junio 2025',
          ticketNum: 3,
          progress: 75,
          remainingDays: 3,
          users: [
            'https://randomuser.me/api/portraits/women/1.jpg',
            'https://randomuser.me/api/portraits/men/2.jpg',
          ]
        },
        {
          image: imagenAdidas,
          title: 'Publicación MeraliCakes',
          ticketNum: 2,
          progress: 25,
          remainingDays: 1,
          users: [
            'https://randomuser.me/api/portraits/women/3.jpg',
            'https://randomuser.me/api/portraits/men/4.jpg',
          ]
        },
        {
          image: imagenAdidas,
          title: 'Banner Web Page',
          ticketNum: 1,
          progress: 50,
          remainingDays: 4,
          users: [
            'https://randomuser.me/api/portraits/men/5.jpg',
          ]
        },
        {
          image: imagenAdidas,
          title: 'Campaña Epson',
          ticketNum: 2,
          progress: 60,
          remainingDays: 2,
          users: [
            'https://randomuser.me/api/portraits/women/6.jpg',
            'https://randomuser.me/api/portraits/women/7.jpg',
          ]
        }
      ]
    };
  },
  computed: {
    filteredPautas() {
      return this.pautas.filter(pauta => {
        const matchesNombre = pauta.titulo.toLowerCase().includes(this.nombre.toLowerCase())
        const matchesCategoria = this.categoria === '' ||
          pauta.cliente.toLowerCase().includes(this.categoria.toLowerCase())
        return matchesNombre && matchesCategoria
      })
    }
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
    },
    selectPauta(pauta) {
      this.selectedPauta = pauta;
    },
    handleSavePauta(newPauta) {
      this.pautas.push(newPauta);
      this.showForm = false;
    }
  },
  mounted() {
    // Seleccionar la primera pauta por defecto
    if (this.pautas.length > 0) {
      this.selectedPauta = this.pautas[0];
    }
  }
};
</script>

<style>
.contenedor-horizontal {
  display: flex;
  flex-direction: row;
}

.v-main {
  background-color: #F8F8F8;
}

.btnAddPauta {
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
  grid-template-columns: 1fr;
  gap: 16px;
}

.buscador-field {
  margin-left: 1vw;
}

.categoria-field {
  margin-left: 100% !important;
  margin-right: -100% !important;
}

.Ordenar-field {
  margin-left: -10% !important;
  margin-right: 20% !important;
}

@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .categoria-field {
    margin-left: 0% !important;
    margin-right: 0% !important;
  }

  .Ordenar-field {
    margin-left: 0% !important;
    margin-right: 0% !important;
  }

  .buscador-field {
    margin-left: 0vw;
  }
}

@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<template>
  <div class="contenedor-horizontal">

    <v-dialog v-model="showForm" max-width="500">
      <FormPauta @close="toggleForm" @save="handleSavePauta" />
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
        <div class="mb-5"> <h4 class="text-subtitle-1 font-weight-medium mb-2">Colaboradores</h4> <v-list density="compact" class="pa-0"> <v-list-item v-for="(colab, i) in selectedPauta.colaboradores" :key="i" class="px-1"> <template v-slot:prepend> <v-avatar color="grey-lighten-1" size="32" class="mr-3"> <v-icon color="white">mdi-account</v-icon> </v-avatar> </template> <v-list-item-title class="text-body-2">{{ colab }}</v-list-item-title> </v-list-item> </v-list> <p class="text-caption text-grey-darken-1 mt-2 ml-1"> <v-icon start size="small">mdi-calendar-blank-outline</v-icon> 8 Abril 2025 </p> </div>
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

        <div class="ticket-column">
          <div class="column-header pa-2"> <span class="column-title">Por hacer</span> <v-spacer></v-spacer> <v-btn icon variant="text" size="x-small" color="grey"> <v-icon>mdi-dots-horizontal</v-icon> </v-btn> </div>
          <div class="ticket-list">
            <TicketCard v-for="task in todoTasks" :key="task.id" v-bind="task" class="mb-2" />
          </div>
        </div>

        <div class="ticket-column">
          <div class="column-header pa-2"> <span class="column-title">En progreso</span> <v-spacer></v-spacer> <v-btn icon variant="text" size="x-small" color="grey"> <v-icon>mdi-dots-horizontal</v-icon> </v-btn> </div>
          <div class="ticket-list">
            <TicketCard v-for="task in inProgressTasks" :key="task.id" v-bind="task" class="mb-2" />
          </div>
        </div>

        <div class="ticket-column">
          <div class="column-header pa-2"> <span class="column-title">Revisión</span> <v-spacer></v-spacer> <v-btn icon variant="text" size="x-small" color="grey"> <v-icon>mdi-dots-horizontal</v-icon> </v-btn> </div>
          <div class="ticket-list">
            <TicketCard v-for="task in reviewTasks" :key="task.id" v-bind="task" class="mb-2" />
          </div>
        </div>

        <div class="ticket-column">
          <div class="column-header pa-2"> <span class="column-title">Terminado</span> <v-spacer></v-spacer> <v-btn icon variant="text" size="x-small" color="grey"> <v-icon>mdi-dots-horizontal</v-icon> </v-btn> </div>
          <div class="ticket-list">
            <TicketCard v-for="task in doneTasks" :key="task.id" v-bind="task" class="mb-2" />
          </div>
        </div>

      </div> </v-card>

    <v-btn @click="toggleForm" variant="outlined" class="btnAddPauta">Nueva pauta</v-btn>

  </div>
</template>

<script>
/* eslint-disable */
import FormPauta from '../components/forms/FormPauta.vue';
import TicketCard from '../components/CardTicket.vue'; // Asegúrate que la ruta es correcta
import imagenAdidas from '@/assets/imagenAdidas.png';

export default {
  name: 'PautasView',
  components: { TicketCard, FormPauta },
  data() {
     return {
      showForm: false,
      selectedPauta: null,
      // Datos de Pautas
      pautas: [
        { id: 1, titulo: 'Campaña Redes Sociales', subtitulo: 'Q2 - MeraliCakes', cliente: 'Pastelería MeraliCakes', descripcion: 'Planificar y ejecutar la campaña de redes sociales para el segundo trimestre, enfocada en nuevos lanzamientos y promociones de temporada. Incluye creación de contenido visual y escrito, programación de posts, interacción con seguidores y análisis de métricas.', colaboradores: ['Cesar Figueroa', 'Meral Rodríguez'], fecha: 'Aug 20, 2025', imagen: 'https://cdn.vuetifyjs.com/images/cards/cooking.png', progreso: 75, diasRestantes: 3 },
        { id: 2, titulo: 'Publicación Semanal', subtitulo: 'Lunes - Instagram/Facebook', cliente: 'Pastelería MeraliCakes', descripcion: 'Diseñar y programar una publicación atractiva para Facebook e Instagram cada lunes, destacando un producto diferente de MeraliCakes. La publicación debe incluir una fotografía de alta calidad del pastel o postre, una descripción creativa y apetitosa, el precio y un llamado a la acción claro (ej: Haz tu pedido ahora!, Conoce el sabor de la semana!). Este texto es más largo para probar el límite de altura y el scroll en la descripción. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', colaboradores: ['Ana López', 'Juan Pérez'], fecha: 'Aug 18, 2025', imagen: 'https://cdn.vuetifyjs.com/images/cards/cake.jpg', progreso: 25, diasRestantes: 1 },
        { id: 3, titulo: 'Edición Fotos Catálogo', subtitulo: 'Productos Temporada', cliente: 'Pastelería MeraliCakes', descripcion: 'Edición profesional de las fotografías tomadas para el nuevo catálogo de temporada. Asegurar la correcta iluminación, colorimetría y retoque de imperfecciones menores manteniendo la naturalidad del producto.', colaboradores: ['Meral Rodríguez', 'Carlos Sánchez'], fecha: 'Aug 20, 2021', imagen: 'https://cdn.vuetifyjs.com/images/cards/camera.jpg', progreso: 50, diasRestantes: 10 }
      ],
      // Datos de Tickets con STATUS y props para CardTicket
      tasks: [
         { id: 't1', status: 'todo', image: 'https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_1280.jpg', title: 'Diseñar Mockups App', description: 'Crear wireframes y mockups alta fidelidad', ticketNum: 1, progress: 0, remainingDays: 5, tag: 'Diseño UX/UI', tagColor: 'pink', users: ['https://randomuser.me/api/portraits/women/1.jpg'] },
        { id: 't2', status: 'todo', image: 'https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_1280.jpg', title: 'Plan Contenido Blog Q3', description: 'Definir temas y calendario editorial', ticketNum: 2, progress: 0, remainingDays: 8, tag: 'Marketing', tagColor: 'orange', users: ['https://randomuser.me/api/portraits/men/2.jpg', 'https://randomuser.me/api/portraits/women/2.jpg'] },
        { id: 't6', status: 'todo', image: null, title: 'Configurar Servidor Staging', description: 'Instalar dependencias y configurar entorno', ticketNum: 6, progress: 0, remainingDays: 3, tag: 'DevOps', tagColor: 'indigo', users: ['https://randomuser.me/api/portraits/men/3.jpg'] },
        { id: 't9', status: 'todo', image: null, title: 'Investigar Librería Gráficos', description: 'Evaluar opciones para dashboard', ticketNum: 9, progress: 0, remainingDays: 10, tag: 'Investigación', tagColor: 'green', users: ['https://randomuser.me/api/portraits/women/6.jpg'] },
        { id: 't3', status: 'inProgress', image: 'https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_1280.jpg', title: 'Desarrollar Landing Page', description: 'Codificar HTML, CSS y JS según diseño', ticketNum: 3, progress: 60, remainingDays: 2, tag: 'Frontend', tagColor: 'teal', users: ['https://randomuser.me/api/portraits/men/5.jpg'] },
        { id: 't7', status: 'inProgress', image: 'https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_1280.jpg', title: 'Preparar Presentación Cliente', description: 'Recopilar datos y crear diapositivas', ticketNum: 7, progress: 30, remainingDays: 1, tag: 'Gestión', tagColor: 'indigo', users: ['https://randomuser.me/api/portraits/women/4.jpg'] },
        { id: 't4', status: 'review', image: 'https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_1280.jpg', title: 'Revisar Textos Web', description: 'Corregir gramática y estilo', ticketNum: 4, progress: 90, remainingDays: 1, tag: 'Copywriting', tagColor: 'cyan', users: ['https://randomuser.me/api/portraits/women/3.jpg'] },
        { id: 't8', status: 'review', image: null, title: 'Code Review API Auth', description: 'Validar lógica y seguridad del código', ticketNum: 8, progress: 95, remainingDays: 0, tag: 'Backend', tagColor: 'red', users: ['https://randomuser.me/api/portraits/men/6.jpg','https://randomuser.me/api/portraits/women/5.jpg'] },
        { id: 't5', status: 'done', image: 'https://cdn.pixabay.com/photo/2020/01/26/20/14/computer-4795762_1280.jpg', title: 'Sesión Fotos Producto X', description: 'Realizada el viernes pasado', ticketNum: 5, progress: 100, remainingDays: 0, tag: 'Fotografía', tagColor: 'pink', users: ['https://randomuser.me/api/portraits/men/4.jpg'] }
      ]
    };
  },
  computed: {
     filteredPautas() { return this.pautas; },
     todoTasks() { return this.tasks.filter(task => task.status === 'todo'); },
     inProgressTasks() { return this.tasks.filter(task => task.status === 'inProgress'); },
     reviewTasks() { return this.tasks.filter(task => task.status === 'review'); },
     doneTasks() { return this.tasks.filter(task => task.status === 'done'); }
  },
  methods: {
    toggleForm() { this.showForm = !this.showForm; },
    selectPauta(pauta) { this.selectedPauta = pauta; },
    handleSavePauta(newPautaData) { const newPauta = { id: Date.now(), titulo: newPautaData.titulo || 'Nueva Pauta', subtitulo: newPautaData.subtitulo || 'Detalles pendientes', cliente: newPautaData.cliente || 'Cliente Desconocido', descripcion: newPautaData.descripcion || 'Sin descripción.', colaboradores: newPautaData.colaboradores || [], fecha: new Date().toISOString().split('T')[0], imagen: newPautaData.imagen || 'https://cdn.vuetifyjs.com/images/cards/docks.jpg', progreso: newPautaData.progreso || 0, diasRestantes: newPautaData.diasRestantes || 0, }; this.pautas.push(newPauta); this.selectedPauta = newPauta; this.showForm = false; }
  },
  mounted() {
    if (this.pautas.length > 0 && !this.selectedPauta) {
      this.selectedPauta = this.pautas[0];
    }
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
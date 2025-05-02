<template>
  <div class="pauta-form">
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <h2 class="form-title">Añadir Ticket</h2>
          <v-spacer></v-spacer>
          <div class="date-header">Hoy {{ currentDate }}</div>
          <v-btn icon @click="dialog = false" class="close-button ml-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Nombre del ticket" v-model="ticket.name" class="rounded-input"
                variant="outlined"></v-text-field>
            </v-col>
          </v-row>
          <!--<v-col cols="6">
              <v-select label="Creativo" v-model="ticket.creativo" :items="creativos" class="rounded-input"
                variant="outlined"></v-select>
            </v-col>-->
          
          <v-row>
            <v-col cols="12">
              <v-select label="Pauta" v-model="pautaSeleccionada" :items="pauta" item-title="titulo" item-value="id"  class="rounded-input"
                variant="outlined"></v-select>
            </v-col>
            
          </v-row>
      
          <v-row>
            <v-col cols="4">
              <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y
                min-width="auto">
                <template v-slot:activator="{ props }">
                  <v-text-field :model-value="formattedDate" label="Fecha de Entrega" prepend-inner-icon="mdi-calendar"
                    readonly v-bind="props" class="rounded-input" variant="outlined"></v-text-field>
                </template>
                <v-date-picker v-model="ticket.fechaEntrega" no-title scrollable
                  :value="ticket.fechaEntrega"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Hora Inicial" v-model="ticket.horaInicial" type="time" class="rounded-input"
                variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Hora Final" v-model="ticket.horaFinal" type="time" class="rounded-input"
                variant="outlined"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-select label="Categoría" v-model="categoriaSeleccionada" :items="categoria"
                item-title="nombre_categoria" item-value="id" class="rounded-input" variant="outlined" />
            </v-col>

            <v-col cols="6">
              <v-select label="Prioridad" v-model="ticket.prioridad" :items="prioridad" item-title="nombre" item-value="id" class="rounded-input"
                variant="outlined"></v-select>
            </v-col>
          </v-row>

          <div class="input-group">
            <v-textarea label="Descripción" v-model="ticket.descripcion" class="rounded-input"
              variant="outlined"></v-textarea>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <div class="file-upload-container d-flex align-center">
            <span class="file-upload-text">Agregar Archivo</span>
            <v-icon class="file-upload-icon ml-2 cursor-pointer" @click="openFileUpload">mdi-paperclip</v-icon>
            <input type="file" ref="fileInput" style="display: none" multiple @change="handleFileUpload">
          </div>
          <div class="ml-auto">
            <v-btn text class="mr-2 cancel-button" @click="dialog = false">Cancelar</v-btn>
            <v-btn color="purple" class="save-button rounded-lg" @click="addTicket">Guardar</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      dialog: true,
      dateMenu: false,
      ticket: {
        name: '',
        descripcion: '',
        imagen: '',
        pauta: '',
        horaInicial: '',
        horaFinal: '',
        fechaEntrega: new Date(), 
        prioridad: null,
      },
      prioridad: [],      
      categoria: [], 
      pauta: [],
      pautaSeleccionada: null,
      categoriaSeleccionada: null,
    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    },
    formattedDate() {
      const date = new Date(this.ticket.fechaEntrega);
      return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  }, mounted() {
    this.obtenerCategoria();
    this.obtenerPrioridades();
    this.obtenerPautas();
  },
  methods: {
    async addTicket() { 
      try {        
        const now = new Date(); // fecha y hora actual
        const usuario = JSON.parse(localStorage.getItem('usuario'));        
        const response = await axios.post('http://localhost:3000/api/addTicket', {
          titulo: this.ticket.name,
          descripcion: this.ticket.descripcion,
          imagen: 'https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg',
          fecha_creacion: now.toISOString(),                        
          fecha_vencimiento: this.ticket.fechaEntrega,
          hora_inicio: this.ticket.horaInicial,
          hora_final: this.ticket.horaFinal,  
          prioridad_id: this.ticket.prioridad,  
          categoria_id: this.categoriaSeleccionada,
          pauta_id: this.pautaSeleccionada,
          creado_por: usuario.id                    
        });

        console.log('Ticket guardado:', response.data);
        this.dialog = false;
      } catch (error) {
        console.error('Error al guardar el ticket:', error);
      }
    },
    openFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const files = event.target.files;
      this.ticket.archivos = Array.from(files);
      console.log('Archivos seleccionados:', this.ticket.archivos);
    },
    async obtenerCategoria() {
      try {
        const response = await axios.get('http://localhost:3000/api/categoria');
        this.categoria = response.data;
      } catch (error) {
        console.error('Error al cargar categorias:', error);
      }
    },async obtenerPrioridades() {
      try {
        const response = await axios.get('http://localhost:3000/api/prioridades');
        this.prioridad = response.data;
      } catch (error) {
        console.error('Error al cargar prioridades:', error);
      }
    },async obtenerPautas() {
      try {
        const response = await axios.get('http://localhost:3000/api/pautas');
        this.pauta = response.data;
      } catch (error) {
        console.error('Error al cargar pautas:', error);
      }
    }
  }
}
</script>

<style scoped>
.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.date-header {
  color: #666;
  font-size: 0.875rem;
}

.close-button {
  margin-left: 8px;
}

.save-button {
  background-color: #9C27B0 !important;
  color: white !important;
  text-transform: none;
}

.cancel-button {
  text-transform: none;
}

.rounded-input .v-input__outline {
  border-radius: 50px !important;
}

.file-upload-container {
  flex-grow: 1;
}

.file-upload-text {
  color: #333;
  font-weight: 500;
}

.file-upload-icon {
  color: #333;
}

.file-upload-icon:hover {
  color: #9C27B0;
}
</style>

<template>
  <div class="pauta-form">
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <h2 class="form-title">Añadir Pauta</h2>
          <v-spacer></v-spacer>
          <div class="date-header">Hoy {{ currentDate }}</div>
          <v-btn icon @click="dialog = false" class="close-button ml-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Titulo" v-model="pauta.name" class="rounded-input" variant="outlined"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field label="Cliente" v-model="pauta.cliente" class="rounded-input"
                variant="outlined"></v-text-field>
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
                <v-date-picker v-model="pauta.fechaEntrega" no-title scrollable
                  :value="pauta.fechaEntrega"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Hora Inicial" v-model="pauta.horaInicial" type="time" class="rounded-input"
                variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Hora Final" v-model="pauta.horaFinal" type="time" class="rounded-input"
                variant="outlined"></v-text-field>
            </v-col>
          </v-row>



          <div class="input-group">
            <v-textarea label="Descripción" v-model="pauta.descripcion" class="rounded-input"
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
            <v-btn color="purple" class="save-button rounded-lg" @click="savePauta">Guardar</v-btn>
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
      pauta: {
        name: '',
        cliente: '',
        imagen: '',
        fechaEntrega: new Date(), // Asegúrate de que sea un objeto Date
        horaInicial: '',
        horaFinal: '',
        descripcion: '',
        creado_por:null
      },

    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    },
    formattedDate() {
      const date = new Date(this.pauta.fechaEntrega);
      return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  },
  methods: {
    async savePauta() {
      try {        
        const now = new Date(); // fecha y hora actual
        const usuario = JSON.parse(localStorage.getItem('usuario'));        
        const response = await axios.post('http://localhost:3000/api/addPauta', {
          cliente: this.pauta.cliente,   
          titulo: this.pauta.name,              
          descripcion: this.pauta.descripcion,
          imagen: 'https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg',
          fecha_inicio: now.toISOString(), 
          fecha_vencimiento: this.pauta.fechaEntrega,
          hora_inicial: this.pauta.horaInicial,
          hora_final: this.pauta.horaFinal,  
          creado_por: usuario.id                    
        });

        console.log('Pauta guardada:', response.data);
        this.dialog = false;
      } catch (error) {
        console.error('Error al guardar la pauta:', error);
      }
    },  
    openFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const files = event.target.files;
      this.ticket.archivos = Array.from(files);
      console.log('Archivos seleccionados:', this.ticket.archivos);
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

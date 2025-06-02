<template>
  <div class="pauta-form">
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center pa-4">
          <h2 class="form-title">Añadir Pauta</h2>
          <v-spacer></v-spacer>
          <div class="date-header">Hoy {{ currentDate }}</div>
          <v-btn icon @click="dialog = false" class="close-button ml-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <!-- Imagen de Portada (upload o link) -->
          <v-row>
            <v-col cols="12">
              <v-menu v-model="showImageSubMenu" offset-y>
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" class="mb-2" rounded="lg" style="background-color: #7209B7; color: white;">
                    <v-icon left>mdi-camera-plus-outline</v-icon> Imagen de Portada
                    <v-icon right small>{{ showImageSubMenu ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="chooseUploadImage">
                    <v-list-item-icon><v-icon>mdi-upload</v-icon></v-list-item-icon>
                    <v-list-item-title>Subir archivo</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="chooseLinkImage">
                    <v-list-item-icon><v-icon>mdi-link-variant</v-icon></v-list-item-icon>
                    <v-list-item-title>Usar Link</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <template v-if="imageInputType==='upload'">
                <div class="d-flex align-center mt-2">
                  <v-btn @click="openImageUpload" small class="mr-2" rounded="lg" style="background-color: #B5179E; color: white;">
                    <v-icon left small>mdi-file-image-outline</v-icon> Seleccionar Archivo
                  </v-btn>
                  <input type="file" ref="imageInput" accept="image/*" style="display: none" @change="handleImageUpload" />
                </div>
                <div v-if="uploadedImageFile && imagePreviewSrc" class="d-flex align-center justify-space-between mt-1">
                  <span class="text-caption">Archivo: {{ uploadedImageFile.name }}</span>
                  <v-btn small icon @click="removeImage" title="Quitar Imagen" density="compact" variant="text" rounded="circle">
                    <v-icon color="red" size="small">mdi-close-circle</v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-else-if="imageInputType==='link'">
                <div class="d-flex align-center mt-2">
                  <v-text-field
                    label="URL de la Imagen"
                    v-model="pauta.imagen"
                    @input="handleLinkInput"
                    class="rounded-input flex-grow-1"
                    variant="outlined"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    prepend-inner-icon="mdi-link"
                    clearable
                    @click:clear="removeImage"
                  />
                  <v-btn v-if="pauta.imagen && imagePreviewSrc" small icon @click="removeImage" title="Quitar Imagen" density="compact" variant="text" class="ml-2" rounded="circle">
                    <v-icon color="red" size="small">mdi-close-circle</v-icon>
                  </v-btn>
                </div>
              </template>
              <div v-if="imagePreviewSrc" class="mt-3 image-preview-container">
                <v-img :src="imagePreviewSrc" max-height="150" aspect-ratio="16/9" contain class="rounded-lg elevation-1"></v-img>
              </div>
            </v-col>
          </v-row>

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
    // default times
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    return {
      dialog: true,
      dateMenu: false,
      pauta: {
        name: '',
        cliente: '',
        imagen: '',
        fechaEntrega: new Date(), // Asegúrate de que sea un objeto Date
        horaInicial: currentTime,
        horaFinal: '23:59',
        descripcion: '',
        creado_por:null
      },
      // image upload/link state
      imageInputType: null,
      uploadedImageFile: null,
      uploadedImagePreview: null,
      showImageSubMenu: false,
    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    },
    formattedDate() {
      const date = new Date(this.pauta.fechaEntrega);
      return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    },
    imagePreviewSrc() {
      if (this.imageInputType==='upload' && this.uploadedImagePreview) return this.uploadedImagePreview;
      if (this.imageInputType==='link' && this.pauta.imagen && this.isHttpUrl(this.pauta.imagen)) return this.pauta.imagen;
      if (!this.imageInputType && this.pauta.imagen) {
        if (this.isHttpUrl(this.pauta.imagen)) return this.pauta.imagen;
        return `http://localhost:3000/uploads/${this.pauta.imagen}`;
      }
      return null;
    }
  },
  methods: {
    async savePauta() {
      // Validaciones de campos obligatorios
      if (!this.pauta.name.trim()) {
        this.$emit && this.$emit('error', 'El título no puede estar vacío.');
        alert('El título no puede estar vacío.');
        return;
      }
      if (!this.pauta.cliente.trim()) {
        this.$emit && this.$emit('error', 'El cliente no puede estar vacío.');
        alert('El cliente no puede estar vacío.');
        return;
      }
      if (!this.pauta.fechaEntrega) {
        this.$emit && this.$emit('error', 'La fecha de entrega es obligatoria.');
        alert('La fecha de entrega es obligatoria.');
        return;
      }
      if (!this.pauta.horaInicial || !this.pauta.horaFinal) {
        this.$emit && this.$emit('error', 'La hora inicial y final son obligatorias.');
        alert('La hora inicial y final son obligatorias.');
        return;
      }
      if (!this.pauta.descripcion.trim()) {
        this.$emit && this.$emit('error', 'La descripción no puede estar vacía.');
        alert('La descripción no puede estar vacía.');
        return;
      }
      try {
        // handle image: upload or link
        let imagenFinal = '';
        if (this.imageInputType==='upload' && this.uploadedImageFile) {
          imagenFinal = await this.uploadPortadaImage();
        } else if (this.imageInputType==='link' && this.pauta.imagen && this.isHttpUrl(this.pauta.imagen)) {
          imagenFinal = `link:${this.pauta.imagen}`;
        }
        const now = new Date();
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await axios.post('http://localhost:3000/api/addPauta', {
          cliente: this.pauta.cliente,
          titulo: this.pauta.name,
          descripcion: this.pauta.descripcion,
          imagen: imagenFinal || null,
          fecha_inicio: now.toISOString(),
          fecha_vencimiento: this.pauta.fechaEntrega,
          hora_inicial: this.pauta.horaInicial,
          hora_final: this.pauta.horaFinal,
          creado_por: usuario.id
        });

        console.log('Pauta guardada:', response.data);
        this.dialog = false;
        this.$emit && this.$emit('close-dialog'); // Emitir evento para que el padre cierre el diálogo correctamente
      } catch (error) {
        console.error('Error al guardar la pauta:', error);
      }
    },
    // new image methods
    setImageInputType(type) {
      this.imageInputType = type;
      this.pauta.imagen = '';
      this.uploadedImageFile = null;
      this.uploadedImagePreview = null;
      this.showImageSubMenu = false;
      if (this.$refs.imageInput) this.$refs.imageInput.value = null;
    },
    openImageUpload() {
      if (this.imageInputType==='upload') this.$refs.imageInput.click();
      else {
        this.setImageInputType('upload');
        this.$nextTick(() => { if(this.$refs.imageInput) this.$refs.imageInput.click(); });
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedImageFile = file;
        const reader = new FileReader();
        reader.onload = e => { this.uploadedImagePreview = e.target.result; };
        reader.readAsDataURL(file);
      } else {
        this.uploadedImageFile = null;
        this.uploadedImagePreview = null;
      }
    },
    handleLinkInput() {
      if (this.imageInputType==='link') {
        this.uploadedImageFile = null;
        this.uploadedImagePreview = null;
        if (this.$refs.imageInput) this.$refs.imageInput.value = null;
      }
    },
    async uploadPortadaImage() {
      if (this.imageInputType==='upload' && this.uploadedImageFile) {
        const formData = new FormData();
        formData.append('imagen', this.uploadedImageFile);
        const res = await axios.post('http://localhost:3000/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return res.data.filename;
      }
      return null;
    },
    removeImage() {
      this.pauta.imagen = '';
      this.uploadedImageFile = null;
      this.uploadedImagePreview = null;
      if (this.$refs.imageInput) this.$refs.imageInput.value = null;
    },
    isHttpUrl(string) {
      try { const url = new URL(string); return url.protocol==='http:'||url.protocol==='https:'; } catch { return false; }
    },
    chooseUploadImage() {
      this.setImageInputType('upload');
    },
    chooseLinkImage() {
      this.setImageInputType('link');
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

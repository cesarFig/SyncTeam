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
                    v-model="form.imagen"
                    @input="handleLinkInput"
                    class="rounded-input flex-grow-1"
                    variant="outlined"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    prepend-inner-icon="mdi-link"
                    clearable
                    @click:clear="removeImage"
                  />
                  <v-btn v-if="form.imagen && imagePreviewSrc" small icon @click="removeImage" title="Quitar Imagen" density="compact" variant="text" class="ml-2" rounded="circle">
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
              <v-text-field label="Titulo" v-model="form.name" class="rounded-input" variant="outlined"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field label="Cliente" v-model="form.cliente" class="rounded-input"
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
                <v-date-picker v-model="form.fechaEntrega" no-title scrollable
                  :value="form.fechaEntrega"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Hora Inicial" v-model="form.horaInicial" type="time" class="rounded-input"
                variant="outlined"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Hora Final" v-model="form.horaFinal" type="time" class="rounded-input"
                variant="outlined"></v-text-field>
            </v-col>
          </v-row>



          <div class="input-group">
            <v-textarea label="Descripción" v-model="form.descripcion" class="rounded-input"
              variant="outlined"></v-textarea>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <div class="ml-auto">
            <v-btn text class="mr-2 cancel-button" @click="dialog = false">Cancelar</v-btn>
            <v-btn color="purple" class="save-button rounded-lg" @click="updatePauta">Guardar</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: ['pautaEdit'],
  data() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const currentTime = `${h}:${m}`;
    return {
      dialog: true,
      dateMenu: false,
      form: {
        id: null,
        name: '',
        cliente: '',
        descripcion: '',
        fechaEntrega: new Date(),
        horaInicial: currentTime,
        horaFinal: '23:59',
        imagen: ''
      },
      // image upload/link state
      imageInputType: null,
      uploadedImageFile: null,
      uploadedImagePreview: null,
      showImageSubMenu: false
    };
  },
  mounted() {
    if (this.pautaEdit) {
      const p = this.pautaEdit;
      this.form.id = p.id;
      this.form.name = p.titulo;
      this.form.cliente = p.cliente;
      this.form.descripcion = p.descripcion;
      this.form.fechaEntrega = new Date(p.fecha_vencimiento || p.fechaEntrega);
      this.form.horaInicial = p.hora_inicial || p.horaInicial;
      this.form.horaFinal = p.hora_final || p.horaFinal;
      // set image and input type
      if (p.imagen?.startsWith('link:')) {
        this.imageInputType = 'link';
        this.form.imagen = p.imagen.substring(5);
      } else if (p.imagen) {
        this.imageInputType = 'upload';
        this.form.imagen = p.imagen;
      }
    }
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    },
    formattedDate() {
      const date = new Date(this.form.fechaEntrega);
      return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    },
    imagePreviewSrc() {
      // if existing image URL from backend, show it directly
      if (this.form.imagen && this.isHttpUrl(this.form.imagen)) return this.form.imagen;
      if (this.imageInputType==='upload' && this.uploadedImagePreview) return this.uploadedImagePreview;
      // show existing uploaded image when editing (filename)
      if (this.imageInputType==='upload' && this.form.imagen) {
        return `${window.location.origin}/uploads/${this.form.imagen}`;
      }
      if (this.imageInputType==='link' && this.form.imagen && this.isHttpUrl(this.form.imagen)) return this.form.imagen;
      if (!this.imageInputType && this.form.imagen) {
        if (this.isHttpUrl(this.form.imagen)) return this.form.imagen;
        return `http://localhost:3000/uploads/${this.form.imagen}`;
      }
      return null;
    }
  },
  methods: {
    async updatePauta() {
      // Validaciones de campos obligatorios y sin solo espacios en blanco
      if (!this.form.name || !this.form.name.trim()) {
        alert('El título no puede estar vacío.');
        return;
      }
      if (!this.form.cliente || !this.form.cliente.trim()) {
        alert('El cliente no puede estar vacío.');
        return;
      }
      if (!this.form.fechaEntrega) {
        alert('La fecha de entrega es obligatoria.');
        return;
      }
      if (!this.form.horaInicial || !this.form.horaFinal) {
        alert('La hora inicial y final son obligatorias.');
        return;
      }
      if (!this.form.descripcion || !this.form.descripcion.trim()) {
        alert('La descripción no puede estar vacía.');
        return;
      }
      try {
        let imagenFinal = ''; 
        if (this.imageInputType==='upload' && this.uploadedImageFile) {
          imagenFinal = await this.uploadPortadaImage();
        } else if (this.imageInputType==='link' && this.isHttpUrl(this.form.imagen)) {
          imagenFinal = `link:${this.form.imagen}`;
        } else {
          // Keep existing upload filename if full URL is loaded
          if (this.imageInputType==='upload' && this.isHttpUrl(this.form.imagen)) {
            imagenFinal = this.form.imagen.split('/').pop();
          } else {
            imagenFinal = this.form.imagen;
          }
        }
        const payload = {
          cliente: this.form.cliente,
          titulo: this.form.name,
          descripcion: this.form.descripcion,
          imagen: imagenFinal,
          fecha_vencimiento: this.form.fechaEntrega,
          hora_inicial: this.form.horaInicial,
          hora_final: this.form.horaFinal
        };
        const res = await axios.put(`http://localhost:3000/api/addPauta/${this.form.id}`, payload);
        this.$emit('save', res.data);
        this.$emit('close');
      } catch (err) {
        console.error('Error al editar pauta:', err);
      }
    },
    // new image methods
    setImageInputType(type) {
      this.imageInputType = type;
      this.form.imagen = '';
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
      this.form.imagen = '';
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
</style>

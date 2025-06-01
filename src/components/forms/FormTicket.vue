<template>
  <div class="pauta-form">
    <v-dialog v-if="dialog" v-model="dialog" max-width="500px" scrollable> <!-- Added scrollable prop -->
      <v-card class="rounded-xl"> <!-- Added rounded-xl class for larger border radius -->
        <v-card-title class="d-flex align-center pa-4">
          <h2 class="form-title">Añadir Ticket</h2>
          <v-spacer></v-spacer>
          <div class="date-header">Hoy {{ currentDate }}</div>
          <v-btn icon @click="dialog = false" class="close-button ml-2" rounded="circle">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pr-4 mr-6"> <!-- Adjusted padding and margin for scrollbar visibility -->
          <v-row>
            <v-col cols="12">
              <v-text-field label="Nombre del ticket" v-model="ticket.name" class="rounded-input" variant="outlined" />
            </v-col>
          </v-row>

          <!-- Imagen de Portada -->
          <v-row>
            <v-col cols="12">
              <v-menu v-model="showImageSubMenu" offset-y>
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" class="mb-2" rounded="lg" style="background-color: #7209B7; color: white;">
                    <v-icon left>mdi-camera-plus-outline</v-icon>
                    Imagen de Portada
                    <v-icon right small>{{ showImageSubMenu ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="setImageInputType('upload')">
                    <v-list-item-icon><v-icon>mdi-upload</v-icon></v-list-item-icon>
                    <v-list-item-title>Subir archivo</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="setImageInputType('link')">
                    <v-list-item-icon><v-icon>mdi-link-variant</v-icon></v-list-item-icon>
                    <v-list-item-title>Usar Link</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <template v-if="imageInputType === 'upload'">
                <div class="d-flex align-center mt-2">
                  <v-btn @click="openImageUpload" small class="mr-2" rounded="lg" style="background-color: #B5179E; color: white;">
                    <v-icon left small>mdi-file-image-outline</v-icon> Seleccionar Archivo
                  </v-btn>
                  <input type="file" ref="imageInput" accept="image/*" style="display: none" @change="handleImageUpload" />
                </div>
                <!-- Modified section for filename and remove button -->
                <div v-if="uploadedImageFile && imagePreviewSrc" class="d-flex align-center justify-space-between mt-1">
                  <span class="text-caption">Archivo: {{ uploadedImageFile.name }}</span>
                  <v-btn small icon @click="removeImage" title="Quitar Imagen" density="compact" variant="text" rounded="circle">
                    <v-icon color="red" size="small">mdi-close-circle</v-icon>
                  </v-btn>
                </div>
              </template>

              <template v-else-if="imageInputType === 'link'">
                <div class="d-flex align-center mt-2">
                  <v-text-field
                    label="URL de la Imagen"
                    v-model="ticket.imagen"
                    @input="handleLinkInput"
                    class="rounded-input flex-grow-1"
                    variant="outlined"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    prepend-inner-icon="mdi-link"
                    clearable
                    @click:clear="removeImage" densité="compact"
                  />
                  <v-btn v-if="ticket.imagen && imagePreviewSrc" small icon @click="removeImage" title="Quitar Imagen" density="compact" variant="text" class="ml-2" rounded="circle">
                    <v-icon color="red" size="small">mdi-close-circle</v-icon>
                  </v-btn>
                </div>
              </template>

              <!-- Preview: Only show image preview, remove button is now with filename for upload type or next to link input -->
              <div v-if="imagePreviewSrc" class="mt-3 image-preview-container">
                <v-img :src="imagePreviewSrc" max-height="150" aspect-ratio="16/9" contain class="rounded-lg elevation-1"></v-img>
                <!-- Removed button from here for link type -->
              </div>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-select
                label="Asignar a"
                v-model="usuarioAsignado"
                :items="usuarios"
                item-title="nombre_completo"
                item-value="id"
                class="rounded-input"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-select
                label="Pauta"
                v-model="pautaSeleccionada"
                :items="pauta"
                item-title="titulo"
                item-value="id"
                class="rounded-input"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
                <template v-slot:activator="{ props }">
                  <v-text-field
                    :model-value="formattedDate"
                    label="Fecha de Entrega"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    class="rounded-input"
                    variant="outlined"
                  />
                </template>
                <v-date-picker v-model="ticket.fechaEntrega" no-title scrollable />
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Hora Inicial" v-model="ticket.horaInicial" type="time" class="rounded-input" variant="outlined" />
            </v-col>
            <v-col cols="4">
              <v-text-field label="Hora Final" v-model="ticket.horaFinal" type="time" class="rounded-input" variant="outlined" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-select
                label="Categoría"
                v-model="categoriaSeleccionada"
                :items="categoria"
                item-title="nombre_categoria"
                item-value="id"
                class="rounded-input"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                label="Prioridad"
                v-model="ticket.prioridad"
                :items="prioridad"
                item-title="nombre"
                item-value="id"
                class="rounded-input"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <div class="input-group">
            <v-textarea label="Descripción" v-model="ticket.descripcion" class="rounded-input" variant="outlined" />
          </div>

          <!-- Archivos seleccionados (arriba de los botones) -->
          <v-list two-line v-if="ticket.archivos.length" class="mt-4">
            <v-list-item
              v-for="(archivo, index) in ticket.archivos"
              :key="index"
              class="d-flex justify-space-between align-center"
            >
              <div>
                <v-list-item-title>{{ archivo.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ (archivo.size / 1024).toFixed(1) }} KB</v-list-item-subtitle>
              </div>
              <v-btn icon @click="eliminarArchivo(index)" rounded="circle">
                <v-icon color="red">mdi-close</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="pa-4">
          <div class="file-upload-container d-flex align-center">
            <span class="file-upload-text">Agregar Archivo Adjunto</span>
            <v-icon class="file-upload-icon ml-2 cursor-pointer" @click="openFileUpload">mdi-paperclip</v-icon>
            <input type="file" ref="fileInput" style="display: none" multiple @change="handleFileUpload" />
          </div>

          <div class="ml-auto">
            <v-btn text class="mr-2 cancel-button" @click="dialog = false" rounded="lg">Cancelar</v-btn>
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
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    return {
      dialog: true,
      dateMenu: false,
      ticket: {
        name: '',
        descripcion: '',
        imagen: '', // Will store URL if 'link', or be set by upload if 'upload'
        pauta: '', // This seems unused, pautaSeleccionada is used
        horaInicial: currentTime, // Set current time as default
        horaFinal: '',
        fechaEntrega: new Date(),
        prioridad: null,
        archivos: [],
      },
      prioridad: [],
      categoria: [],
      pauta: [],
      pautaSeleccionada: null,
      categoriaSeleccionada: null,
      usuarioAsignado: null,
      usuarios: [],
      
      // New data properties for image handling
      imageInputType: null, // 'upload' or 'link'
      uploadedImageFile: null, // Stores the File object for upload
      uploadedImagePreview: null, // Stores base64 preview for uploaded file
      showImageSubMenu: false,
    };
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
    formattedDate() {
      const date = new Date(this.ticket.fechaEntrega);
      // Ensure ticket.fechaEntrega is a valid date before formatting
      if (isNaN(date.getTime())) {
        return 'Seleccionar fecha';
      }
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
    imagePreviewSrc() {
      if (this.imageInputType === 'upload' && this.uploadedImagePreview) {
        return this.uploadedImagePreview;
      }
      if (this.imageInputType === 'link' && this.ticket.imagen && this.isHttpUrl(this.ticket.imagen)) {
        return this.ticket.imagen;
      }
      // For displaying an existing image when editing (not primary focus here but good for completeness)
      if (!this.imageInputType && this.ticket.imagen) {
        if (this.isHttpUrl(this.ticket.imagen)) return this.ticket.imagen;
        // Assuming it's a filename from backend
        return `http://localhost:3000/uploads/${this.ticket.imagen}`;
      }
      return null;
    },
  },
  mounted() {
    this.obtenerCategoria();
    this.obtenerPrioridades();
    this.obtenerPautas();
    this.obtenerUsuarios();
  },
  methods: {
    eliminarArchivo(index) {
      this.ticket.archivos.splice(index, 1);
    },
    openFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const files = event.target.files;
      this.ticket.archivos.push(...Array.from(files));
      console.log('Archivos adjuntos seleccionados:', this.ticket.archivos);
    },

    // --- New/Modified Image Methods ---
    setImageInputType(type) {
      this.imageInputType = type;
      this.ticket.imagen = ''; // Clear previous image value
      this.uploadedImageFile = null;
      this.uploadedImagePreview = null;
      this.showImageSubMenu = false; // Close menu after selection
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = null; // Clear file input
      }
    },
    openImageUpload() {
      if (this.imageInputType === 'upload') {
         this.$refs.imageInput.click();
      } else {
        // If user clicks generic "select file" when type is not 'upload', switch to 'upload' and open
        this.setImageInputType('upload');
        this.$nextTick(() => {
          if(this.$refs.imageInput) this.$refs.imageInput.click();
        });
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedImageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
        // Do not set this.ticket.imagen here; it will be set after successful upload
      } else {
        this.uploadedImageFile = null;
        this.uploadedImagePreview = null;
      }
    },
    handleLinkInput() {
      // Called on @input of the v-text-field for the link.
      // If user types a link, clear any previously selected file.
      if (this.imageInputType === 'link') {
        this.uploadedImageFile = null;
        this.uploadedImagePreview = null;
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = null;
        }
      }
    },
    async uploadPortadaImage() {
      if (this.imageInputType === 'upload' && this.uploadedImageFile) {
        try {
          const formData = new FormData();
          formData.append('imagen', this.uploadedImageFile); // Server expects 'imagen'
          const res = await axios.post('http://localhost:3000/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          return res.data.filename; // Return the server-generated filename
        } catch (err) {
          console.error('Error al subir imagen de portada:', err);
          throw err; // Re-throw the error to be caught by the caller
        }
      }
      return null; // No file to upload or not in 'upload' mode
    },
    removeImage() {
      this.ticket.imagen = '';
      this.uploadedImageFile = null;
      this.uploadedImagePreview = null;
      // Only reset imageInputType if we are not in 'link' mode with an empty field, 
      // otherwise user can't type a new link after clearing.
      // If it was 'upload', or if it's 'link' and the field is now empty, we can reset type.
      if (this.imageInputType === 'upload' || (this.imageInputType === 'link' && !this.ticket.imagen)) {
         // No, keep imageInputType as 'link' if it was link, so the field stays visible.
         // Let user choose a different type via menu if they want.
      }
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = null;
      }
      // If the type was 'link' and it's now empty, the preview will disappear.
      // If the type was 'upload', the file and preview are cleared.
      // The main goal is to clear the visual representation of the image.
    },
    isHttpUrl(string) {
      if (typeof string !== 'string') return false;
      try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch (_) {
        return false;
      }
    },
    // --- End of New/Modified Image Methods ---

    async addTicket() {
      try {
        let imagenFinalParaGuardar = '';

        if (this.imageInputType === 'upload' && this.uploadedImageFile) {
          imagenFinalParaGuardar = await this.uploadPortadaImage();
        } else if (this.imageInputType === 'link' && this.ticket.imagen && this.isHttpUrl(this.ticket.imagen)) {
          imagenFinalParaGuardar = `link:${this.ticket.imagen}`; // This is the URL, prefixed
        }

        const now = new Date();
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await axios.post('http://localhost:3000/api/addTicket', {
          titulo: this.ticket.name,
          descripcion: this.ticket.descripcion,
          imagen: imagenFinalParaGuardar || 'link:https://www.thewall360.com/uploadImages/ExtImages/images1/def-638240706028967470.jpg', // Updated default image
          fecha_creacion: now.toISOString(),
          fecha_vencimiento: this.ticket.fechaEntrega ? new Date(this.ticket.fechaEntrega).toISOString() : null,
          hora_inicio: this.ticket.horaInicial,
          hora_final: this.ticket.horaFinal,
          prioridad_id: this.ticket.prioridad,
          categoria_id: this.categoriaSeleccionada,
          pauta_id: this.pautaSeleccionada,
          creado_por: usuario.id,
        });

        const ticketId = response.data.ticketId;

        for (const archivo of this.ticket.archivos) {
          const formData = new FormData();
          formData.append('imagen', archivo); // Backend route /api/upload expects 'imagen'
          formData.append('ticket_id', ticketId);
          // formData.append('pauta_id', ''); // Keep if backend needs it, otherwise can remove
          formData.append('tipo_archivo', archivo.type);
          formData.append('is_attach', true); // Differentiate from portada image if needed
          formData.append('subido_por', usuario.id);

          await axios.post('http://localhost:3000/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }

        await axios.post('http://localhost:3000/api/asignacion', {
          ticket_id: ticketId,
          usuario_id: this.usuarioAsignado,
          fecha_asignacion: now.toISOString(),
          asignado_por: usuario.id
        });

        console.log('Ticket y archivos guardados');
        this.dialog = false;
        this.$emit('ticket-saved'); // Emit an event
        window.location.reload(); // Reload the page
      } catch (error) {
        console.error('Error al guardar el ticket:', error);
        // TODO: Show user friendly error
      }
    },
    // ...existing methods (obtenerUsuarios, obtenerCategoria, etc.)
    async obtenerUsuarios() {
      try {
        const response = await axios.get('http://localhost:3000/api/usuarios/getUsuarios');
        this.usuarios = response.data.map(u => ({
          ...u,
          nombre_completo: `${u.nombre} ${u.apellidos}`
        }));
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    },
    async obtenerCategoria() {
      try {
        const response = await axios.get('http://localhost:3000/api/categoria');
        this.categoria = response.data;
      } catch (error) {
        console.error('Error al cargar categorias:', error);
      }
    },
    async obtenerPrioridades() {
      try {
        const response = await axios.get('http://localhost:3000/api/prioridades');
        this.prioridad = response.data;
      } catch (error) {
        console.error('Error al cargar prioridades:', error);
      }
    },
    async obtenerPautas() {
      try {
        const response = await axios.get('http://localhost:3000/api/pautas');
        this.pauta = response.data;
      } catch (error) {
        console.error('Error al cargar pautas:', error);
      }
    },
  },
};
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
/* Replaced rule for rounded inputs */
.rounded-input .v-field { /* Targets the main container for outlined/filled/solo fields */
  border-radius: 25px !important;
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
.image-preview-container {
  position: relative;
  max-width: 100%; /* Ensure it doesn't overflow card */
  display: inline-block; /* To wrap tightly around the image */
}
.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>

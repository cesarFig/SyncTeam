<template>
  <div class="pauta-form">
    <v-dialog v-if="dialog" v-model="dialog" max-width="500px" scrollable> <!-- Added scrollable prop -->
      <v-card class="rounded-xl"> <!-- Added rounded-xl class -->
        <v-card-title class="d-flex align-center pa-4">
          <h2 class="form-title">Editar Ticket</h2>
          <v-spacer></v-spacer>
          <div class="date-header">Hoy {{ currentDate }}</div>
          <v-btn icon @click="dialog = false" class="close-button ml-2" rounded="circle"> <!-- Added rounded=\"circle\" -->
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pr-4 mr-6"> <!-- Adjusted padding and margin -->
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
                  <input type="file" ref="imageInput" accept="image/*" style="display: none" @change="handleImageUploadChange" />
                </div>
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
                    @input="handleLinkInputChange"
                    class="rounded-input flex-grow-1"
                    variant="outlined"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    prepend-inner-icon="mdi-link"
                    clearable
                    @click:clear="removeImage" densité="compact"
                  />
                  <v-btn v-if="ticket.imagen && imagePreviewSrc && imageInputType === 'link'" small icon @click="removeImage" title="Quitar Imagen" density="compact" variant="text" class="ml-2" rounded="circle">
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
              <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
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

          <v-textarea label="Descripción" v-model="ticket.descripcion" class="rounded-input" variant="outlined" />

          <!-- Lista de archivos adjuntos -->
          <v-list two-line v-if="ticket.archivos && ticket.archivos.length" class="mt-4">
            <v-list-item
              v-for="(archivo, index) in ticket.archivos"
              :key="archivo.id || index"
              class="d-flex justify-space-between align-center"
            >
              <div>
                <v-list-item-title>{{ archivo.nombre_archivo || archivo.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ archivo.tipo_archivo || archivo.type || 'Archivo' }}</v-list-item-subtitle>
              </div>
              <v-btn icon @click="eliminarArchivoExistente(archivo, index)" rounded="circle">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="pa-4">
          <!-- Removed v-spacer, added file upload similar to FormTicket -->
          <div class="file-upload-container d-flex align-center">
            <span class="file-upload-text">Agregar Archivo Adjunto</span>
            <v-icon class="file-upload-icon ml-2 cursor-pointer" @click="openFileUpload">mdi-paperclip</v-icon>
            <input type="file" ref="fileInput" style="display: none" multiple @change="handleFileUploadChange" />
          </div>
          <div class="ml-auto"> <!-- Ensure buttons are pushed to the right -->
            <v-btn text class="mr-2 cancel-button" @click="dialog = false" rounded="lg">Cancelar</v-btn> <!-- Added rounded="lg" -->
            <v-btn color="purple" class="save-button" @click="editTicket" rounded="lg">Guardar Cambios</v-btn> <!-- Added rounded="lg" -->
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    ticketEdit: Object,
  },
  data() {
    return {
      dialog: true,
      dateMenu: false,
      ticket: {
        id: null,
        name: '',
        descripcion: '',
        imagen: '', // Stores the final image string (URL, link:URL, or filename)
        pauta: '', // This seems unused, pautaSeleccionada is used
        horaInicial: '',
        horaFinal: '',
        fechaEntrega: new Date(),
        prioridad: null,
        archivos: [], // For existing attachments
        nuevosArchivos: [], // For new attachments to be uploaded
      },
      pautaSeleccionada: null,
      categoriaSeleccionada: null,
      usuarioAsignado: null,
      prioridad: [],
      categoria: [],
      pauta: [],
      usuarios: [],

      // New data properties for image handling (from FormTicket)
      imageInputType: null, // 'upload', 'link', or null if using existing image initially
      uploadedImageFile: null, // Stores the File object for new upload
      uploadedImagePreview: null, // Stores base64 preview for new uploaded file
      showImageSubMenu: false,
      // imagePreviewSrc is a computed property
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
      if (!this.ticket.fechaEntrega) return 'Seleccionar fecha';
      const date = new Date(this.ticket.fechaEntrega);
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
      // Priority 1: New image selected for upload
      if (this.imageInputType === 'upload' && this.uploadedImagePreview) {
        return this.uploadedImagePreview;
      }
      // Priority 2: New link entered
      if (this.imageInputType === 'link' && this.ticket.imagen && this.isHttpUrl(this.ticket.imagen)) {
        return this.ticket.imagen;
      }
      // Priority 3: Existing image (could be URL, link:URL or filename)
      if (!this.imageInputType && this.ticket.imagen) { // No new input type selected yet
        if (this.ticket.imagen.startsWith('link:')) {
          const url = this.ticket.imagen.substring(5);
          if (this.isHttpUrl(url)) return url;
        } else if (this.isHttpUrl(this.ticket.imagen)) {
          return this.ticket.imagen; // It's a direct URL
        } else if (this.ticket.imagen !== 'link:https://www.thewall360.com/uploadImages/ExtImages/images1/def-638240706028967470.jpg') {
          // Assumed to be a filename from backend for existing uploaded image
          return `http://localhost:3000/uploads/${this.ticket.imagen}`;
        }
      }
      // Default or no image
      if (this.ticket.imagen === 'link:https://www.thewall360.com/uploadImages/ExtImages/images1/def-638240706028967470.jpg'){
        return `link:https://www.thewall360.com/uploadImages/ExtImages/images1/def-638240706028967470.jpg`; // Or your local asset path
      }
      return null; // No preview if none of the above
    },
  },
  mounted() {
    if (this.ticketEdit) {
      let initialImagen = this.ticketEdit.imagen || '';
      let initialImageInputType = null;

      if (initialImagen.startsWith('link:')) {
        initialImageInputType = 'link';
        initialImagen = initialImagen.substring(5);
      } else if (this.isHttpUrl(initialImagen)){
        initialImageInputType = 'link'; // Treat existing full URLs as if they were links
      } else if (initialImagen && initialImagen !== 'link:https://www.thewall360.com/uploadImages/ExtImages/images1/def-638240706028967470.jpg') {
        initialImageInputType = 'upload'; // To signify it was an uploaded file
        // We don't have the File object, but preview will be handled by imagePreviewSrc
      }

      this.ticket = {
        id: this.ticketEdit.id,
        name: this.ticketEdit.titulo || '',
        descripcion: this.ticketEdit.descripcion || '',
        imagen: initialImagen, // Store the raw value (URL or filename)
        fechaEntrega: this.ticketEdit.fecha_vencimiento
          ? new Date(this.ticketEdit.fecha_vencimiento)
          : null,
        horaInicial: this.ticketEdit.hora_inicio?.slice(0, 5) || '',
        horaFinal: this.ticketEdit.hora_final?.slice(0, 5) || '',
        prioridad: this.ticketEdit.prioridad_id || null,
        archivos: this.ticketEdit.attachments || [],
        nuevosArchivos: [],
      };
      this.imageInputType = initialImageInputType; // Set the determined input type

      this.pautaSeleccionada = this.ticketEdit.pauta_id || null;
      this.categoriaSeleccionada = this.ticketEdit.categoria_id || null;
      this.usuarioAsignado = this.ticketEdit.usuario_id || null;
    }

    this.obtenerCategoria();
    this.obtenerPrioridades();
    this.obtenerPautas();
    this.obtenerUsuarios();
  },
  methods: {
    // --- Image Handling Methods (from FormTicket, adapted for edit) ---
    setImageInputType(type) {
      this.imageInputType = type;
      // When changing type, we assume a new image will be chosen.
      // Clear previous temporary states for new uploads/links.
      this.ticket.imagen = ''; // Clear the model for imagen URL/link input
      this.uploadedImageFile = null;
      this.uploadedImagePreview = null;
      this.showImageSubMenu = false;
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = null; // Clear file input
      }
    },

    openImageUpload() { // For the "Seleccionar Archivo" button inside the 'upload' type UI
      if (this.$refs.imageInput) {
         this.$refs.imageInput.click();
      }
    },

    handleImageUploadChange(event) { // Renamed from handleImageUpload
      const file = event.target.files[0];
      if (file) {
        this.uploadedImageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImagePreview = e.target.result;
          // this.ticket.imagen is not set here; filename comes from server after uploadPortadaImage
        };
        reader.readAsDataURL(file);
      } else {
        this.uploadedImageFile = null;
        this.uploadedImagePreview = null;
      }
    },

    handleLinkInputChange() { // Renamed from handleLinkInput
      // This method is called on @input of the v-text-field for the link.
      // If user types a link, ensure any previously selected file (for upload) is cleared.
      if (this.imageInputType === 'link') {
        this.uploadedImageFile = null;
        this.uploadedImagePreview = null;
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = null;
        }
        // The v-model on ticket.imagen handles the actual link string update.
        // imagePreviewSrc will react to changes in this.ticket.imagen.
      }
    },

    async uploadPortadaImage() { // For new image uploads
      if (this.imageInputType === 'upload' && this.uploadedImageFile) {
        try {
          const formData = new FormData();
          formData.append('imagen', this.uploadedImageFile);
          const res = await axios.post('http://localhost:3000/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          return res.data.filename; // Return the server-generated filename
        } catch (err) {
          console.error('Error al subir nueva imagen de portada:', err);
          throw err;
        }
      }
      return null; // No new file to upload
    },

    removeImage() {
      this.ticket.imagen = ''; // Clear the image model
      this.uploadedImageFile = null;
      this.uploadedImagePreview = null;
      // this.imageInputType = null; // Keep the selected type (upload/link) so UI doesn't hide
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = null;
      }
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
    // --- End of Image Handling Methods ---

    // --- Attachment Handling Methods ---
    openFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileUploadChange(event) {
      const files = Array.from(event.target.files);
      this.ticket.nuevosArchivos.push(...files);
      // Optionally, provide user feedback about selected files
      console.log('Nuevos archivos para adjuntar:', this.ticket.nuevosArchivos);
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = null; // Clear file input to allow selecting same file again if removed
      }
    },
    async eliminarNuevoArchivo(index) { // For newly added, not yet uploaded files
        this.ticket.nuevosArchivos.splice(index, 1);
    },
    async eliminarArchivoExistente(archivo, index) { // For existing attachments from server
      // This method was called `eliminarArchivo` before, renamed for clarity
      const confirmado = confirm(`¿Deseas eliminar el archivo "${archivo.nombre_archivo || archivo.name}"? Este archivo ya está guardado en el servidor.`);
      if (!confirmado) return;

      try {
        // Assuming archivo.id is the ID of the attachment record in the database
        await axios.delete(`http://localhost:3000/api/archivo/${archivo.id}`);
        this.ticket.archivos.splice(index, 1); // Remove from local list of existing attachments
        console.log('Archivo existente eliminado del servidor y localmente');
      } catch (error) {
        console.error('Error al eliminar archivo existente:', error);
        // TODO: Show user friendly error
      }
    },
    // --- End of Attachment Handling ---

    async editTicket() {
      // Validaciones de campos obligatorios y sin solo espacios en blanco
      if (!this.ticket.name || !this.ticket.name.trim()) {
        alert('El nombre del ticket no puede estar vacío.');
        return;
      }
      if (!this.ticket.descripcion || !this.ticket.descripcion.trim()) {
        alert('La descripción no puede estar vacía.');
        return;
      }
      if (!this.ticket.fechaEntrega) {
        alert('La fecha de entrega es obligatoria.');
        return;
      }
      if (!this.ticket.horaInicial || !this.ticket.horaFinal) {
        alert('La hora inicial y final son obligatorias.');
        return;
      }

      try {
        let imagenFinalParaGuardar = this.ticketEdit.imagen; // Default to original image

        if (this.imageInputType === 'upload' && this.uploadedImageFile) {
          // New image uploaded
          imagenFinalParaGuardar = await this.uploadPortadaImage();
        } else if (this.imageInputType === 'link') {
          // Link is used or updated
          if (this.ticket.imagen && this.isHttpUrl(this.ticket.imagen)) {
            imagenFinalParaGuardar = `link:${this.ticket.imagen}`;
          } else {
            // Link was cleared or invalid
            imagenFinalParaGuardar = 'link:https://www.thewall360.com/uploadImages/ExtImages/images1/def-638240706028967470.jpg';
          }
        } else if (this.imageInputType === null && this.ticket.imagen === '') {
            // Existing image was removed (ticket.imagen is empty, and no new type selected)
            imagenFinalParaGuardar = 'link:https://www.thewall360.com/uploadImages/ExtImages/images1/def-638240706028967470.jpg';
        }
        // If imageInputType is null and ticket.imagen is not empty, it means the original image is kept (already in imagenFinalParaGuardar)
        
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        await axios.put(`http://localhost:3000/api/addTicket/tickets/${this.ticket.id}`, {
          titulo: this.ticket.name,
          descripcion: this.ticket.descripcion,
          imagen: imagenFinalParaGuardar, // Use the determined image value
          fecha_vencimiento: this.ticket.fechaEntrega ? new Date(this.ticket.fechaEntrega).toISOString() : null,
          hora_inicio: this.ticket.horaInicial,
          hora_final: this.ticket.horaFinal,
          prioridad_id: this.ticket.prioridad,
          categoria_id: this.categoriaSeleccionada,
          pauta_id: this.pautaSeleccionada,
          // editado_por: usuario.id, // Optional: track who edited
        });

        // Handle new attachments
        if (this.ticket.nuevosArchivos.length > 0) {
          const formData = new FormData();
          formData.append('ticket_id', this.ticket.id);
          formData.append('subido_por', usuario.id);
          // formData.append('pauta_id', this.pautaSeleccionada); // If needed by backend for attachments

          for (const archivo of this.ticket.nuevosArchivos) {
            formData.append('archivosNuevos', archivo); // Backend should handle multiple files with this key
          }
          // Adjust endpoint and payload as per your backend for multiple new files
          await axios.post(`http://localhost:3000/api/upload/ticket/${this.ticket.id}/attachments`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }

        // Update assignment if changed
        if (this.usuarioAsignado !== this.ticketEdit.usuario_id) {
            await axios.put(`http://localhost:3000/api/asignacion/${this.ticket.id}`, { // Assuming PUT to update assignment
            usuario_id: this.usuarioAsignado,
            asignado_por: usuario.id, // Or reasignado_por
            fecha_asignacion: new Date().toISOString(),
            });
        }

        console.log('Ticket editado correctamente');
        this.dialog = false;
        this.$emit('ticket-edited'); // Emit an event
        window.location.reload(); // Reload the page
      } catch (error) {
        console.error('Error al editar el ticket:', error);
        // TODO: Show user friendly error
      }
    },

    // Added missing helper methods
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
  background-color: #9C27B0 !important; /* Vuetify might need !important for overrides */
  color: white !important;
  text-transform: none;
  /* rounded-lg is applied via prop, so no need for border-radius here if using prop */
}

.cancel-button {
  text-transform: none;
  /* rounded-lg is applied via prop */
}

/* Consistent rounded inputs with FormTicket */
.rounded-input .v-field { 
  border-radius: 25px !important;
}

/* Styles for file upload section (from FormTicket) */
.file-upload-container {
  flex-grow: 1; /* Allow it to take space if needed */
}

.file-upload-text {
  color: #333;
  font-weight: 500;
}

.file-upload-icon {
  color: #333;
}

.file-upload-icon:hover {
  color: #9C27B0; /* Theme color on hover */
}

/* Styles for image preview (from FormTicket) */
.image-preview-container {
  position: relative;
  max-width: 100%; 
  display: inline-block; 
}

/* Optional: if you had a specific remove button style for preview in FormTicket */
.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Ensure existing attachment list items are styled well */
.v-list-item__title {
  font-weight: 500;
}

.v-list-item__subtitle {
  font-size: 0.8rem;
  color: #555;
}
</style>

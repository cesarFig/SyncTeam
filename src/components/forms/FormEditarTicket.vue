<template>
  <div class="pauta-form">
    <v-dialog v-if="dialog" v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <h2 class="form-title">Editar Ticket</h2>
          <v-spacer></v-spacer>
          <div class="date-header">Hoy {{ currentDate }}</div>
          <v-btn icon @click="dialog = false" class="close-button ml-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Nombre del ticket" v-model="ticket.name" class="rounded-input" variant="outlined" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <span class="file-upload-text">Imagen de Portada</span>
              <v-icon class="file-upload-icon ml-2 cursor-pointer" @click="openImageUpload">mdi-camera</v-icon>
              <input type="file" ref="imageInput" accept="image/*" style="display: none" @change="handleImageUpload" />
              <div v-if="ticket.imagen" class="mt-2">{{ ticket.imagen }}</div>
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
          <v-list two-line v-if="ticket.archivos.length" class="mt-4">
            <v-list-item
              v-for="(archivo, index) in ticket.archivos"
              :key="index"
              class="d-flex justify-space-between align-center"
            >
              <div>
                <v-list-item-title>{{ archivo.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ archivo.type || 'Archivo' }}</v-list-item-subtitle>
              </div>
              <v-btn icon color="red" @click="eliminarArchivo(archivo, index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn text class="mr-2 cancel-button" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="purple" class="save-button rounded-lg" @click="editTicket">Guardar Cambios</v-btn>
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
        imagen: '',
        pauta: '',
        horaInicial: '',
        horaFinal: '',
        fechaEntrega: new Date(),
        prioridad: null,
        archivos: [],
      },
      pautaSeleccionada: null,
      categoriaSeleccionada: null,
      usuarioAsignado: null,
      prioridad: [],
      categoria: [],
      pauta: [],
      usuarios: [],
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
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
  },
  mounted() {
    if (this.ticketEdit) {
      this.ticket = {
        id: this.ticketEdit.id,
        name: this.ticketEdit.titulo || '',
        descripcion: this.ticketEdit.descripcion || '',
        imagen: this.ticketEdit.imagen || '',
        fechaEntrega: this.ticketEdit.fecha_vencimiento
          ? new Date(this.ticketEdit.fecha_vencimiento)
          : null,
        horaInicial: this.ticketEdit.hora_inicio?.slice(0, 5) || '',
        horaFinal: this.ticketEdit.hora_final?.slice(0, 5) || '',
        prioridad: this.ticketEdit.prioridad_id || null,
        archivos: this.ticketEdit.attachments || [],
      };

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
    async eliminarArchivo(archivo, index) {
      const confirmado = confirm(`¿Deseas eliminar el archivo "${archivo.name}"?`);
      if (!confirmado) return;

      try {
        await axios.delete(`http://localhost:3000/api/archivo/${archivo.id}`);
        this.ticket.archivos.splice(index, 1);
        console.log('Archivo eliminado');
      } catch (error) {
        console.error('Error al eliminar archivo:', error);
      }
    },
    async obtenerUsuarios() {
      try {
        const response = await axios.get('http://localhost:3000/api/usuarios/getUsuarios');
        this.usuarios = response.data.map(u => ({
          ...u,
          nombre_completo: `${u.nombre} ${u.apellidos}`,
        }));
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    },
    async editTicket() {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        await axios.put(`http://localhost:3000/api/addTicket/tickets/${this.ticket.id}`, {
          titulo: this.ticket.name,
          descripcion: this.ticket.descripcion,
          imagen: this.ticket.imagen,
          fecha_vencimiento: this.ticket.fechaEntrega,
          hora_inicio: this.ticket.horaInicial,
          hora_final: this.ticket.horaFinal,
          prioridad_id: this.ticket.prioridad,
          categoria_id: this.categoriaSeleccionada,
          pauta_id: this.pautaSeleccionada,
        });

        await axios.put(`http://localhost:3000/api/${this.ticket.id}`, {
          usuario_id: this.usuarioAsignado,
          asignado_por: usuario.id,
        });

        console.log('Ticket editado correctamente');
        this.dialog = false;
      } catch (error) {
        console.error('Error al editar el ticket:', error);
      }
    },
    openImageUpload() {
      this.$refs.imageInput.click();
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('imagen', file);

          const res = await axios.post('http://localhost:3000/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          this.ticket.imagen = res.data.filename;
        } catch (err) {
          console.error('Error al subir imagen:', err);
        }
      }
    },
    async obtenerCategoria() {
      try {
        const response = await axios.get('http://localhost:3000/api/categoria');
        this.categoria = response.data;
      } catch (error) {
        console.error('Error al cargar categorías:', error);
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

.rounded-input .v-input__outline {
  border-radius: 50px !important;
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

<template>
  <v-container>
    <h1>Vista de Desarrollo para TicketFull</h1>
    <p>Haz clic en el botón para abrir el modal de detalle del ticket.</p>

    <v-btn color="primary" @click="openDialog" class="mt-4">
      Abrir Detalle Ticket (Ejemplo)
    </v-btn>

    <v-dialog v-model="dialogVisible" max-width="800px" scrollable>
      <TicketFull
        :ticket="sampleTicketData"
        @close-modal="closeDialog"
      />
      </v-dialog>
  </v-container>
</template>

<script>
// 1. Importar el componente (ajusta la ruta según tu estructura)
import TicketFull from "@/components/TicketFull.vue"; // O '../components/tickets/TicketFull.vue', etc.

export default {
  name: "DevView",
  // 2. Registrar el componente
  components: {
    TicketFull,
  },
  data() {
    return {
      // 3. Variable para controlar la visibilidad del diálogo
      dialogVisible: false,
      // 4. Datos de ejemplo para pasar al componente como prop
      sampleTicketData: {
        id: "dev-t1",
        image: "https://cdn.pixabay.com/photo/2017/12/22/08/01/school-supplies-3033204_1280.jpg", // Usa una imagen válida
        title: "Probar Componente Detalle Ticket",
        assignee: "Desarrollador Vue",
        date: new Date().toISOString(), // Fecha actual
        description:
          "Este es un texto de descripción largo para probar cómo se ve el contenido dentro del modal y si el scroll funciona correctamente cuando la descripción o la actividad ocupan mucho espacio vertical. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        // Objeto para tipo de tarea (nombre visible y color de la barra izquierda)
        taskType: { name: "Frontend", color: "#2196F3" }, // Azul
        // Objeto para prioridad (nombre visible y color de la barra derecha)
        priority: { name: "Alta", color: "#f44336" }, // Rojo
        // Array de adjuntos
        attachments: [
          { name: "screenshot-modal.png", url: "#", type: "image" },
          { name: "user-flow.pdf", url: "#", type: "pdf" },
          { name: "requirements.docx", url: "#", type: "document" },
        ],
        // Array de logs de actividad
        activityLog: [
          {
            user: {
              name: "Alicia Developer",
              avatar: "https://randomuser.me/api/portraits/women/10.jpg",
            },
            action: "cambió la prioridad a Alta.",
            timestamp: "Hace 5 minutos", // Idealmente formateado desde una fecha real
          },
          {
            user: {
              name: "Roberto Tester",
              avatar: "https://randomuser.me/api/portraits/men/11.jpg",
            },
            action: "añadió el adjunto screenshot-modal.png",
            timestamp: "Hace 1 hora",
          },
          {
            user: {
              name: "Alicia Developer",
              avatar: "https://randomuser.me/api/portraits/women/10.jpg",
            },
            action: "creó el ticket.",
            timestamp: "Hace 3 horas",
          },
           {
            user: {
              name: "Roberto Tester",
              avatar: "https://randomuser.me/api/portraits/men/11.jpg",
            },
            action: "añadió un comentario: 'Revisar el flujo de datos'.",
            timestamp: "Ayer",
          },
        ],
        // Usuario actual para el campo de comentario
        currentUser: {
          name: "Tu Usuario",
          avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // Tu avatar
        },
        // Otros campos que tu TicketFull pueda necesitar
        status: 'inProgress', // Ejemplo
        progress: 65, // Ejemplo
        // ...etc
      },
    };
  },
  methods: {
    // 5. Métodos para abrir y cerrar el diálogo
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
/* Puedes añadir estilos específicos para DevView si es necesario */
.v-container {
  padding: 2rem;
}
</style>
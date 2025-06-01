<template>
  <v-card class="dashboard-ticket-card" width="400" style="height: 95vh;">
    <div>
      <v-card-title class="headline">Ticket activo</v-card-title>
      <v-row no-gutters>
        <v-col cols="12">
          <v-img 
            v-if="props.imagenPrincipal" 
            :src="finalImageSrc" 
            height="200px" 
            cover 
            class="ma-2 rounded-17"
            @error="handleImageError"
          ></v-img>
          <v-responsive v-else height="200px" class="ma-2 grey lighten-2 rounded-17 d-flex align-center justify-center">
            <v-icon size="50">mdi-image-off-outline</v-icon>
          </v-responsive>
        </v-col>
      </v-row>

      <v-card-text class="pt-2 card-content-area"> <!-- Added class card-content-area -->
        <h2 class="title text-h5 font-weight-bold mb-1">{{ tituloTicket }}</h2>
        <p class="pauta text-subtitle-1 grey--text text--darken-1 mb-3">Pauta: {{ pautaNombre }}</p>

        <div class="progreso-section mb-3">
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="text-subtitle-1 font-weight-medium">Progreso</span>
            <span class="text-h6 font-weight-bold primary--text">{{ progreso }}%</span>
          </div>
          <v-progress-linear :model-value="progreso" color="primary" height="10" rounded></v-progress-linear>
        </div>

        <div class="d-flex align-center text-subtitle-1 mb-4">
          <v-icon left :color="horasRestantes === 0 ? 'red' : undefined">{{ iconoTiempo }}</v-icon>
          <span v-if="horasRestantes > 0" class="grey--text text--darken-2">
            {{ horasRestantes }} Horas restantes
          </span>
          <span v-else class="red--text font-weight-bold">
            Ticket retrasado
          </span>
        </div>

        <v-divider class="my-3"></v-divider>

        <div class="detalles-ticket-section">
          <div class="d-flex justify-space-between align-center mb-2">
            <h3 class="text-h6 font-weight-medium">Detalles ticket</h3>
            <span v-if="rolAsignado" class="text-subtitle-2 grey--text text--darken-1">{{ rolAsignado }}</span>
          </div>
          <p v-if="descripcion" class="text-body-1 text-justify descripcion-truncada">{{ descripcion }}</p>
          <p v-else class="text-body-1 grey--text">No hay descripción disponible.</p>
        </div>
      </v-card-text>
    </div>


    <v-card-actions class="pa-4 mt-auto"> <!-- Added mt-auto to push to bottom, or rely on flex-grow of content -->
      <v-btn class="boton" block large @click="irAlTicket">
        Ir al ticket
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps, computed, ref, defineEmits } from 'vue'; // Imported defineEmits
import defaultImageSource from '@/assets/default-image.png';

const emit = defineEmits(['open-ticket-details']); // Defined emits

const props = defineProps({
  imagenPrincipal: {
    type: String,
    default: null, // Default to null, so we can distinguish between not provided and explicitly default
  },
  tituloTicket: {
    type: String,
    required: true,
  },
  pautaNombre: {
    type: String,
    required: true,
  },
  progreso: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100,
  },
  horasRestantes: {
    type: Number,
    required: true,
  },
  iconoTiempo: {
    type: String,
    default: 'mdi-clock-outline',
  },
  rolAsignado: {
    type: String,
    default: '',
  },
  descripcion: {
    type: String,
    default: '', 
  },
  ticketId: {
    type: [String, Number],
    required: true,
  }
});

const imageLoadError = ref(false);

const finalImageSrc = computed(() => {
  if (imageLoadError.value) {
    return defaultImageSource;
  }
  if (props.imagenPrincipal && typeof props.imagenPrincipal === 'string' && props.imagenPrincipal !== defaultImageSource) {
    // Check if it's a full URL already (e.g. from a previous default or external source)
    if (props.imagenPrincipal.startsWith('http') || props.imagenPrincipal.startsWith('/')) {
        return props.imagenPrincipal;
    }
    return `http://localhost:3000/uploads/${props.imagenPrincipal}`;
  }
  return defaultImageSource; // Fallback to default if null, empty, or already the default path
});

const handleImageError = () => {
  console.warn('Image failed to load, falling back to default:', props.imagenPrincipal);
  imageLoadError.value = true;
};

const irAlTicket = () => {
  emit('open-ticket-details', props.ticketId); // Emit event
};
</script>

<style scoped>
.headline {
  padding-top: 15px;
  font-weight: 600;
  font-size: 1rem;
}

.rounded-17 {
  border-radius: 17px !important;
}

.dashboard-ticket-card {
  font-family: 'Poppins', sans-serif;
  border-radius: 16px !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
  display: flex;
  flex-direction: column;
}

.card-content-area {
  overflow-y: auto;
}

.detalles-ticket-section {
  padding: 15px;
}

.title {
  line-height: 1.3;
}

.pauta {
  line-height: 1.4;
}

.v-list-item {
  min-height: auto !important;
}

.v-btn {
  text-transform: none;
  font-weight: bold;
  letter-spacing: 0.5px;
  border-radius: 8px !important;
}

.boton {
  padding: 15 px;
  background-color: #3A0CA3;
  color: #fff;
}

.text-justify {
  text-align: justify;
}

.descripcion-truncada {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 7; 
  line-clamp: 3; 
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

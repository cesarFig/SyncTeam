<template>
  <div class="card">
    <div v-if="image_url" class="image-container">
      <img :src="image_url" alt="Task Image" class="task-image" />
    </div>
    <div v-if="categoriaNombre" class="tag-container">
        <span class="tag-chip" :style="{ backgroundColor: categoriaColor || '#eee', color: getTextColor(categoriaColor) }">
            {{ categoriaNombre }}
        </span>
     </div>

    <div class="content">
      <h2 class="title">{{ titulo }}</h2>
      <p v-if="descripcion" class="description">{{ descripcion }}</p>
      <p class="info">Categoría: {{ nombre_categoria }}</p>
      <p class="info">Creado el: {{ fecha_creacion }}</p>
      <p class="info">Vence el: {{ fecha_vencimiento }}</p>
      <p class="info">Días restantes: {{ remainingDays }}</p>
      <p class="info">Progreso: {{ progreso }}%</p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    id_ticket: Number,
    titulo: String,
    descripcion: String,
    image_url: String,
    fecha_creacion: String,
    fecha_vencimiento: String,
    estado: Number, // Estado del ticket (1-4)
    nombre_categoria: String, // Nombre de la categoría
    categoriaColor: String // Color RGB de la categoría
  },
  computed: {
    remainingDays() {
      const today = new Date(); // Fecha actual
      const dueDate = new Date(this.fecha_vencimiento);
      const timeDiff = dueDate - today;
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convertir a días
    },
    progreso() {
      switch (this.estado) {
        case 1:
          return 0;
        case 2:
          return 25;
        case 3:
          return 50;
        case 4:
          return 100;
        default:
          return 0;
      }
    }
  },
  methods: {
    getTextColor(bgColor) {
      if (!bgColor) return '#333';
      try {
        if (bgColor.startsWith('#')) {
          const r = parseInt(bgColor.slice(1, 3), 16);
          const g = parseInt(bgColor.slice(3, 5), 16);
          const b = parseInt(bgColor.slice(5, 7), 16);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness > 150 ? '#333' : '#fff';
        }
      } catch (e) {}
      return '#333';
    }
  }
};
</script>

<style scoped>
.card {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  border: 1px solid #eee;
  transition: box-shadow 0.2s ease-in-out;
}
.card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.image-container {
  width: 100%;
}

.task-image {
  width: 100%;
  height: 75px;
  object-fit: cover;
  display: block;
}

.tag-container {
  padding: 6px 8px 0px 8px;
}

.tag-chip {
  display: inline-block;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 10px;
  line-height: 1.4;
}

.content {
  padding: 8px;
}

.title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info {
  color: #666;
  font-size: 11px;
  margin-bottom: 6px;
}
</style>
<template>
  <div class="card">
    <div v-if="imagen" class="image-container">
      <img :src="imageSrc" alt="Task Image" class="task-image" />
    </div>
    <div v-if="nombre_categoria" class="tag-container">
      <span class="tag-chip" :style="{ backgroundColor: color_rgb || '#eee', color: getTextColor(color_rgb) }">
        {{ nombre_categoria }}
      </span>
    </div>


    <div class="content">
      <h2 class="title">{{ titulo }}</h2>
      <p v-if="descripcion" class="description">{{ descripcion }}</p>
      <div class="progress-container">
        <div class="progress-header">
          <span>Progreso</span>
          <span class="progress-text">{{ progreso }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progreso + '%' }">
            <div class="progress-circle"></div>
          </div>
        </div>
      </div>

      <div class="footer-info">
        <div class="time-remaining">
          <span class="clock-icon">⏳</span> <span v-html="remainingDays"></span> </div>
        <div class="user-list">
          <span class="user-icon">👤</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    id: Number,
    titulo: String,
    descripcion: String,
    imagen: String,
    fecha_creacion: String,
    fecha_vencimiento: String,
    estado: Number, // Estado del ticket (1-4)
    nombre_categoria: String, // Nombre de la categoría
    color_rgb: String
  },
  computed: {
    imageSrc() {
      const img = this.imagen || '';
      // If prefixed with 'link:', strip it
      if (img.startsWith('link:')) {
        return img.substring(5);
      }
      // If already full URL, return as is
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      // Otherwise, treat as local upload filename
      return img ? `http://localhost:3000/uploads/${img}` : '';
    },
    remainingDays() {
      if (this.estado === 4) {
        return "<span style='color: green;'>Completado</span>";
      }

      const today = new Date();
      const dueDate = new Date(this.fecha_vencimiento);
      const timeDiff = dueDate - today;
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysRemaining === 0) {
        return "<span style='color: blue;'>Hoy</span>";
      } else if (daysRemaining < 0) {
        return "<span style='color: red;'>Ticket retrasado</span>";
      }

      return `${daysRemaining} Días`;
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
  width: 100%; /* Ocupa el ancho de su contenedor (columna Kanban) */
  background: white;
  border-radius: 12px; /* Más sutil */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08); /* Sombra más suave */
  overflow: hidden;
  font-family: 'Poppins', sans-serif; /* Asegúrate que Poppins esté cargada */
  border: 1px solid #eee; /* Borde muy ligero */
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;
}
.card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.image-container {
  width: 100%;
}

.task-image {
  width: 100%;
  height: 75px; /* Altura reducida */
  object-fit: cover;
  display: block; /* Evita espacio extra bajo la imagen */
}

.tag-container {
    padding: 6px 8px 0px 8px; /* Espacio arriba y lados */
}

.tag-chip {
    display: inline-block;
    padding: 2px 8px;
    font-size: 10px; /* Muy pequeño */
    font-weight: 500;
    border-radius: 10px;
    line-height: 1.4;
}


.content {
  padding: 8px; /* Padding reducido */
}

.title {
  font-size: 14px; /* Reducido */
  font-weight: 500;
  margin-bottom: 4px; /* Reducido */
  line-height: 1.3;
  /* Evita overflow de texto */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
    font-size: 12px; /* Descripción más pequeña */
    color: #666;
    line-height: 1.4;
    margin-bottom: 8px; /* Espacio antes de progreso */
    /* Limitar a 2 líneas con ellipsis */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.info { /* Ticket Num - Oculto por defecto ahora */
  color: #666;
  font-size: 11px;
  margin-bottom: 6px;
}

.progress-container {
  margin-top: 8px; /* Ajustado */
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #555;
  margin-bottom: 3px; /* Ajustado */
}
.progress-text{
    font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e9ecef; /* Gris más claro */
  border-radius: 2px;
  position: relative;
  margin-top: 2px;
}

.progress-fill {
  height: 100%;
  /* Color por defecto, podría venir de props */
  background: linear-gradient(90deg, #7b2cbf, #f72586);
  border-radius: 2px;
  position: relative;
  transition: width 0.4s ease-out;
}

.progress-circle {
  width: 10px; height: 10px;
  /* Mismo color que la barra o un color distintivo */
  background: #f72586;
  border: 1px solid white; /* Borde para destacar */
  box-shadow: 0 0 3px rgba(0,0,0,0.2);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
}

.footer-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px; /* Ajustado */
}

.time-remaining {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #666;
}

.clock-icon {
  margin-right: 4px;
  font-size: 12px; /* Ajustar si es emoji o icono */
}

.user-list {
  display: flex;
  align-items: center; /* Centrar verticalmente */
  padding-left: 8px; /* Espacio para solapamiento inicial */
}

.user-avatar {
  width: 22px; /* Reducido */
  height: 22px; /* Reducido */
  border-radius: 50%;
  border: 1.5px solid white; /* Ajustado */
  margin-left: -8px; /* Solapamiento */
  background-color: #ccc; /* Fondo por si falla la imagen */
  display: block; /* Asegura que no haya espacio extra */
}
.user-more {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: #e9ecef;
    color: #666;
    font-size: 9px;
    font-weight: 500;
    margin-left: -8px;
    border: 1.5px solid white;
    z-index: 0; /* Detrás de los avatares */
}

</style>
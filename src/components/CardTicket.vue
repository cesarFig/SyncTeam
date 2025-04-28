<template>
  <div class="card">
    <div v-if="image" class="image-container">
      <img :src="image" alt="Task Image" class="task-image" />
    </div>
    <div v-if="tag" class="tag-container">
        <span class="tag-chip" :style="{ backgroundColor: tagColor || '#eee', color: getTextColor(tagColor) }">
            {{ tag }}
        </span>
     </div>


    <div class="content">
      <h2 class="title">{{ title }}</h2>
      <p v-if="description" class="description">{{ description }}</p>
      <div class="progress-container">
        <div class="progress-header">
          <span>Progreso</span>
          <span class="progress-text">{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }">
            <div class="progress-circle"></div>
          </div>
        </div>
      </div>

      <div class="footer-info">
        <div class="time-remaining">
          <span class="clock-icon">⏳</span> <span>{{ remainingDays }} Días</span> </div>
        <div class="user-list">
          <img
            v-for="(user, index) in users.slice(0, 3)"
            :key="index"
            :src="user"
            class="user-avatar"
            :style="{ zIndex: 3 - index }"
           />
           <span v-if="users.length > 3" class="user-more">
             +{{ users.length - 3 }}
           </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: String,
    title: String,
    description: String, // Añadida prop descripción
    ticketNum: Number, // Se mantiene pero no se muestra por defecto
    progress: Number,
    remainingDays: [Number, String],
    users: {
        type: Array,
        default: () => [] // Default a array vacío
    },
    tag: String, // Prop para tag tipo "Diseño", "Marketing"
    tagColor: String // Prop para color del tag
  },
  methods: {
    // Helper simple para decidir si el texto del tag debe ser blanco u oscuro
    getTextColor(bgColor) {
      if (!bgColor) return '#333'; // Color oscuro por defecto
      // Simple heurística basada en colores comunes de Vuetify/CSS
      const darkColors = ['deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'lime', 'blue-grey', 'red', 'pink', 'purple'];
      const lightColors = ['amber', 'orange', 'yellow', 'light-green', 'grey'];
      if (darkColors.some(color => bgColor.includes(color))) {
          return '#fff'; // Texto blanco para fondos oscuros/saturados
      }
       if (lightColors.some(color => bgColor.includes(color))) {
           return '#555'; // Texto oscuro para fondos claros
      }
      // Intenta convertir a hex si es nombre de color CSS básico
      // (Esto es muy básico, una librería sería mejor para colores complejos)
      try {
          // Lógica muy simplificada para hex
           if (bgColor.startsWith('#')) {
                const r = parseInt(bgColor.slice(1, 3), 16);
                const g = parseInt(bgColor.slice(3, 5), 16);
                const b = parseInt(bgColor.slice(5, 7), 16);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness > 150 ? '#333' : '#fff'; // Umbral de brillo
           }
      } catch(e) { /* Ignora error */ }

      return '#333'; // Fallback
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
<template>
  <div class="calendario-wrapper">
    <vue-cal
      style="height: 90vh;"
      :time="true"
      :on-event-click="onEventClick"
      :events="events"
      default-view="week"
      active-view="week"
      :week-start="1"
      :disable-views="['years', 'year', 'month', 'day']"
      :time-from="8 * 60"
      :time-to="20 * 60"
      :hide-title-bar="false"
      :hide-view-selector="true"
      class="custom-cal"
    />
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
  components: { VueCal },
  data() {
    return {
      events: [
        {
          title: 'Publicación MeraliCakes',
          start: '2025-04-14 09:00',
          end: '2025-04-14 10:00',
          content: 'Post diario para MeraliCakes',
          class: 'event-blue'
        },
        {
          title: 'Edición Banner ITM',
          start: '2025-04-14 11:00',
          end: '2025-04-14 12:00',
          class: 'event-orange'
        },
        {
          title: 'Diseño de flyer digital',
          start: '2025-04-14 13:00',
          end: '2025-04-14 14:00',
          class: 'event-pink'
        },
        {
          title: 'Webinar promoción',
          start: '2025-04-16 11:00',
          end: '2025-04-16 13:00',
          class: 'event-yellow'
        }
        // Puedes agregar más eventos aquí
      ]
    }
  },
  methods: {
    onEventClick(event) {
      alert(`Evento: ${event.title}`)
    }
  }
}
</script>

<style>
/* Estilos generales */
.calendario-wrapper {
  padding: 20px;
  background: #f7f8fc;
}

/* Estilos personalizados para los eventos */
.vuecal__event.event-blue {
  background-color: #2575fc;
  border-left: 4px solid #004bb5;
  color: white;
  border-radius: 8px;
}

.vuecal__event.event-orange {
  background-color: #ff7f50;
  border-left: 4px solid #d94600;
  color: white;
  border-radius: 8px;
}

.vuecal__event.event-pink {
  background-color: #ffb6c1;
  border-left: 4px solid #d6336c;
  color: #333;
  border-radius: 8px;
}

.vuecal__event.event-yellow {
  background-color: #ffe066;
  border-left: 4px solid #f0ad00;
  color: #333;
  border-radius: 8px;
}

/* Bordes redondeados y colores suaves */
.vuecal__cell {
  border-radius: 8px;
  transition: background 0.3s;
}

.vuecal__header {
  font-weight: bold;
  font-size: 1rem;
}

/* Elimina sombreado y mejora la limpieza visual */
.vuecal__event {
  box-shadow: none;
  padding: 8px;
}
</style>

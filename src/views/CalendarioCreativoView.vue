<template>
  <div class="calendar-container">
    <!-- Barra de control personalizada -->
    <div class="custom-controls pa-4">
      <v-btn style="box-shadow: none;" @click="goToToday">Hola</v-btn>
      <div class="d-flex align-center">
        <v-btn icon @click="previousPeriod" class="mr-2" style="box-shadow: none; background: none;">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <h1 class="title font-weight-medium">{{ currentDateRange }}</h1>

        <v-btn icon @click="nextPeriod" class="mr-4" style="box-shadow: none; background: none;">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <div class="d-flex align-center">
        <v-btn-toggle v-model="activeView" mandatory>
          <v-btn value="year" @click="changeView('year')">Año</v-btn>
          <v-btn value="month" @click="changeView('month')">Mes</v-btn>
          <v-btn value="week" @click="changeView('week')">Semana</v-btn>
          <v-btn value="day" @click="changeView('day')">Día</v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <!-- Calendario -->
    <vue-cal
      ref="vuecal"
      locale="es"
      style="height: 75vh;"
      :time="true"
      :events="events"
      :on-event-click="onEventClick"
      :default-view="activeView"
      :active-view="activeView"
      :week-start="1"
      :disable-views="disabledViews"
      :time-from="8 * 60"
      :time-to="20 * 60"
      :hide-title-bar="true"
      :hide-view-selector="true"
      class="custom-cal"
      @view-change="updateCurrentDate"
    >
      <template #event="{ event }">
        <div class="event-content" :style="event.class">
          <strong>{{ event.title }}</strong>
          <div class="event-time">{{ event.start.formatTime('HH:mm') }} - {{ event.end.formatTime('HH:mm') }}</div>
        </div>
      </template>

      <template #no-event>
        <div></div>
      </template>
    </vue-cal>
  </div>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  components: { VueCal },
  data() {
    return {
      activeView: 'week',
      currentDate: new Date(),
      events: [] // ← Aquí se cargan los tickets
    };
  },
  computed: {
    disabledViews() {
      const allViews = ['years', 'year', 'month', 'week', 'day'];
      return allViews.filter(view => view !== this.activeView);
    },
    currentDateRange() {
      if (!this.$refs.vuecal) return this.formatDate(this.currentDate);
      const view = this.$refs.vuecal.view;
      const start = view.startDate;
      const end = view.endDate;

      switch (this.activeView) {
        case 'year':
          return start.getFullYear();
        case 'month':
          return start.toLocaleString('es', { month: 'long', year: 'numeric' });
        case 'week':
          return `${start.getDate()} - ${end.getDate()} de ${start.toLocaleString('es', { month: 'long' })}`;
        case 'day':
          return start.toLocaleString('es', { weekday: 'long', day: 'numeric', month: 'long' });
        default:
          return this.formatDate(this.currentDate);
      }
    }
  },
  mounted() {
    this.fetchTickets();
  },
  methods: {
    formatDate(date) {
      return date.toLocaleDateString('es', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    changeView(view) {
      this.activeView = view;
      this.$nextTick(() => {
        if (this.$refs.vuecal) {
          this.$refs.vuecal.switchView(view);
          this.updateCurrentDate();
        }
      });
    },
    previousPeriod() {
      if (this.$refs.vuecal) {
        this.$refs.vuecal.previous();
        this.updateCurrentDate();
      }
    },
    nextPeriod() {
      if (this.$refs.vuecal) {
        this.$refs.vuecal.next();
        this.updateCurrentDate();
      }
    },
    goToToday() {
      if (this.$refs.vuecal) {
        this.$refs.vuecal.switchToToday();
        this.updateCurrentDate();
      }
    },
    updateCurrentDate() {
      if (this.$refs.vuecal) {
        this.currentDate = new Date(this.$refs.vuecal.view.startDate);
      }
    },
    onEventClick(event) {
      console.log('Evento seleccionado:', event);
      // Puedes abrir un modal aquí si quieres
    },
    getStyleFromColor(color) {
      return {
        backgroundColor: color,
        borderLeft: `4px solid ${color}`,
        color: '#fff'
      };
    },
    async fetchTickets() {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.id) {
          console.error('Usuario no encontrado en localStorage');
          return;
        }

        const response = await fetch('http://localhost:3000/api/usuarios/getTickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: usuario.id })
        });

        const data = await response.json();
        console.log(data);
        this.events = data.map(ticket => ({
          id: ticket.id,
          title: ticket.titulo,
          start: `${ticket.fecha_vencimiento} ${ticket.hora_inicio}`,
          end: `${ticket.fecha_vencimiento} ${ticket.hora_final}`,
          class: this.getStyleFromColor(ticket.color_rgb)
        }));

        console.log('Eventos cargados en calendario:', this.events);
      } catch (error) {
        console.error('Error al cargar tickets:', error);
      }
    }
  }
};
</script>

<style scoped>
.calendar-container {
  background: #f7f8fc;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.custom-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  color: #333;
  font-size: 1.1rem;
  min-width: 300px;
  text-align: center;
}

.event-content {
  padding: 4px;
  font-size: 0.85rem;
  border-radius: 6px;
}

.event-time {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 960px) {
  .custom-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .title {
    font-size: 1rem;
    min-width: auto;
    text-align: left;
  }

  .v-btn-toggle {
    width: 100%;
  }

  .v-btn-toggle .v-btn {
    flex: 1;
    min-width: auto;
  }
}
</style>

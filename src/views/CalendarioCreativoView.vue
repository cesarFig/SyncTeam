<template>
  <div class="calendar-container">
    <!-- Barra de control personalizada -->
    <div class="custom-controls pa-4">
      <v-btn style="box-shadow: none;" @click="goToToday">Hoy</v-btn>
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
      :cell-height="80"
      class="custom-cal"
      @view-change="updateCurrentDate"
    >
      <template #event="{ event }">
        <div class="pretty-event" :style="event.class">
          <div class="event-title" :title="event.title">{{ event.title }}</div>
          <div class="event-time">{{ event.end.formatTime('HH:mm') }}</div>
        </div>
      </template>
      <template #no-event><div></div></template>
    </vue-cal>
    <!-- Modal de Detalles -->
<v-dialog v-model="showModal" max-width="700">
  <TicketDetailModal :ticket="selectedTicket" @close-modal="showModal = false" />
</v-dialog>

  </div>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import TicketDetailModal from '@/components/TicketFull.vue'; // Ajusta el path si lo tienes en otro lado


export default {
  name: 'CalendarioCreativo',
  components: { VueCal,TicketDetailModal },
  data() {
    return {
      activeView: 'week',
      currentDate: new Date(),
      events: [],
    };
  },
  computed: {
    disabledViews() {
      return ['years', 'year', 'month', 'week', 'day'].filter(v => v !== this.activeView);
    },
    currentDateRange() {
      if (!this.$refs.vuecal) return this.formatDate(this.currentDate);
      const { startDate: start, endDate: end } = this.$refs.vuecal.view;
      switch (this.activeView) {
        case 'year': return start.getFullYear();
        case 'month': return start.toLocaleString('es', { month: 'long', year: 'numeric' });
        case 'week': return `${start.getDate()} - ${end.getDate()} de ${start.toLocaleString('es', { month: 'long' })}`;
        case 'day': return start.toLocaleString('es', { weekday: 'long', day: 'numeric', month: 'long' });
        default: return this.formatDate(this.currentDate);
      }
    }
  },
  mounted() { this.fetchTickets(); },
  methods: {
    formatDate(d) {
      return d.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    changeView(v) { this.activeView = v; this.$nextTick(() => { this.$refs.vuecal?.switchView(v); this.updateCurrentDate(); }); },
    previousPeriod() { this.$refs.vuecal?.previous(); this.updateCurrentDate(); },
    nextPeriod() { this.$refs.vuecal?.next(); this.updateCurrentDate(); },
    goToToday() { this.$refs.vuecal?.switchToToday(); this.updateCurrentDate(); },
    updateCurrentDate() { if (this.$refs.vuecal) this.currentDate = new Date(this.$refs.vuecal.view.startDate); },
    onEventClick(event) {
  const ticketId = event.id;
  const ticketOriginal = this.events.find(t => t.id === ticketId);

  if (ticketOriginal) {
    this.selectedTicket = {
      id: ticketOriginal.id,
      titulo: ticketOriginal.title,
      color: ticketOriginal.class?.backgroundColor || "#999",
      fecha: ticketOriginal.start,
      descripcion: "Aquí iría la descripción si la necesitas", // Puedes mejorar esto si lo tienes
      image: ticketOriginal.image || '', // Opcional si manejas imágenes
      assignee: "Asignado a alguien", // Opcional si tienes el nombre
    };
    this.showModal = true;
  }
}
,
    getStyleFromColor(color) {
      const isLight = hex => {
        const c = hex.replace('#', '');
        const [r, g, b] = [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16));
        return (r * 299 + g * 587 + b * 114) / 1000 > 180;
      };
      return { backgroundColor: color, borderLeft: `4px solid ${color}`, color: isLight(color) ? '#000' : '#fff' };
    },
    async fetchTickets() {
      try {
        const u = JSON.parse(localStorage.getItem('usuario')); if (!u?.id) throw 'Usuario no encontrado';
        const res = await fetch('http://localhost:3000/api/usuarios/getTickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id }) });
        const data = await res.json();
        this.events = data.map(t => {
          const [fecha] = t.fecha_vencimiento.split('T');
          const [y, mo, d] = fecha.split('-').map(Number);
          const [he] = t.hora_final.split(':').map(Number);
          const start = new Date(y, mo - 1, d, he, 0);
          const end = new Date(y, mo - 1, d, he + 1, 0);
          return { id: t.id, title: t.titulo, start, end, class: this.getStyleFromColor(t.color_rgb) };
        });
        this.$nextTick(() => this.$refs.vuecal?.switchView(this.activeView));
      } catch (err) { console.error('Error al cargar tickets:', err); }
    }
  }
};
</script>

<style>
.calendar-container {
  background: #f7f8fc;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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

/* CELDA del calendario con padding interno */
.vuecal__cell-content {
  padding: 8px !important;
  box-sizing: border-box;
}

/* EVENTO personalizado */
.pretty-event {
  position: relative;
  width: 100%;
  height: auto;
  margin: 4px 0;
  padding: 8px 10px;
  box-sizing: border-box;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: transform 0.2s ease;
  cursor: pointer;
}
.pretty-event:hover {
  transform: scale(1.02);
}

/* TÍTULO */
.event-title {
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

/* HORA */
.event-time {
  font-size: 0.75rem;
  opacity: 0.8;
}
</style>

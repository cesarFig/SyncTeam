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
  
      <!-- Calendario VueCal -->
      <vue-cal
        ref="vuecal"
        locale="es"
        style="height: 75vh;"
        :time="true"
        :events="filteredEvents"
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
          <div :class="['event-content', event.class]">
            <strong>{{ event.title }}</strong>
            <div class="event-time">{{ event.start.formatTime('HH:mm') }} - {{ event.end.formatTime('HH:mm') }}</div>
          </div>
        </template>
        <template #no-event>
          <div></div>
        </template>
      </vue-cal>
  
      <!-- Diálogo para nuevo evento -->
      <v-dialog v-model="showEventForm" max-width="600">
        <event-form @close="showEventForm = false" @save="addNewEvent" />
      </v-dialog>
    </div>
  </template>
  
  <script>
  import VueCal from 'vue-cal'
  import 'vue-cal/dist/vuecal.css'
  
  export default {
    components: { VueCal },
    data() {
      return {
        activeView: 'week',
        showEventForm: false,
        currentDate: new Date(),
        events: [
          {
            id: 1,
            title: 'Revisión de diseño',
            start: '2025-04-15 09:00',
            end: '2025-04-15 10:00',
            type: 'meeting',
            class: 'event-blue'
          },
          {
            id: 2,
            title: 'Entrega de assets',
            start: '2025-04-15 14:00',
            end: '2025-04-15 15:30',
            type: 'task',
            class: 'event-orange'
          }
        ]
      }
    },
    computed: {
      disabledViews() {
        const allViews = ['years', 'year', 'month', 'week', 'day']
        return allViews.filter(view => view !== this.activeView)
      },
      currentDateRange() {
        if (!this.$refs.vuecal) return this.formatDate(this.currentDate)
        const view = this.$refs.vuecal.view
        const start = view.startDate
        const end = view.endDate
  
        switch (this.activeView) {
          case 'year':
            return start.getFullYear()
          case 'month':
            return start.toLocaleString('es', { month: 'long', year: 'numeric' })
          case 'week':
            return `${start.getDate()} - ${end.getDate()} de ${start.toLocaleString('es', { month: 'long' })}`
          case 'day':
            return start.toLocaleString('es', { weekday: 'long', day: 'numeric', month: 'long' })
          default:
            return this.formatDate(this.currentDate)
        }
      },
      filteredEvents() {
        return this.events
      }
    },
    methods: {
      formatDate(date) {
        return date.toLocaleDateString('es', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
      changeView(view) {
        this.activeView = view
        this.$nextTick(() => {
          if (this.$refs.vuecal) {
            this.$refs.vuecal.switchView(view)
            this.updateCurrentDate()
          }
        })
      },
      previousPeriod() {
        if (this.$refs.vuecal) {
          this.$refs.vuecal.previous()
          this.updateCurrentDate()
        }
      },
      nextPeriod() {
        if (this.$refs.vuecal) {
          this.$refs.vuecal.next()
          this.updateCurrentDate()
        }
      },
      goToToday() {
        if (this.$refs.vuecal) {
          this.$refs.vuecal.switchToToday()
          this.updateCurrentDate()
        }
      },
      updateCurrentDate() {
        if (this.$refs.vuecal) {
          this.currentDate = new Date(this.$refs.vuecal.view.startDate)
        }
      },
      onEventClick(event) {
        this.$emit('event-selected', event)
      },
      addNewEvent(newEvent) {
        this.events.push({
          ...newEvent,
          id: Math.max(...this.events.map(e => e.id), 0) + 1
        })
        this.showEventForm = false
      }
    }
  }
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
    background: none;
    border-radius: 8px;
    box-shadow: none;
  }
  
  .title {
    color: #333;
    font-size: 1.1rem; /* 🔽 Título más pequeño */
    min-width: 300px;
    text-align: center;
  }
  
  /* Estilos para eventos */
  .event-blue {
    background-color: #2575fc;
    border-left: 4px solid #004bb5;
    color: white;
  }
  
  .event-orange {
    background-color: #ff7f50;
    border-left: 4px solid #d94600;
    color: white;
  }
  
  .event-content {
    padding: 4px;
    font-size: 0.85rem;
  }
  
  .event-time {
    font-size: 0.75rem;
    opacity: 0.9;
  }
  
  /* Botones de vista */
  .v-btn-toggle {
    border-radius: 8px;
    overflow: hidden;
  }
  
  .v-btn-toggle .v-btn {
    min-width: 80px;
  }
  
  .v-btn-toggle .v-btn:first-child {
    border-radius: 8px 0 0 8px !important;
  }
  
  .v-btn-toggle .v-btn:last-child {
    border-radius: 0 8px 8px 0 !important;
  }
  
  .v-btn-toggle .v-btn:not(:first-child):not(:last-child) {
    border-radius: 0 !important;
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
  
  @media (max-width: 600px) {
    .calendar-container {
      padding: 10px;
    }
  
    .vuecal {
      height: 65vh !important;
    }
  }
  
  /* Ajuste preciso de alineación de eventos */
  :deep(.vuecal__time-cell),
  :deep(.vuecal__bg .vuecal__time-cell) {
    height: 65px !important;
    min-height: 65px !important;
  }
  
  :deep(.vuecal__event) {
    height: auto !important;
    margin-top: 18px !important; /* ✅ Baja los eventos para alinearse con la hora */
    margin-left: 4px !important;
    margin-right: 4px !important;
    padding: 6px 8px !important;
    position: absolute;
    width: calc(100% - 8px);
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.vuecal__event--focus) {
    height: auto !important;
  }
  
  :deep(.vuecal__now-line) {
    top: 65px !important;
  }
  
  /* Día especial */
  :deep(.vuecal--day-view .vuecal__time-cell) {
    height: 80px !important;
  }
  
  :deep(.vuecal--day-view .vuecal__now-line) {
    top: 80px !important;
  }
  </style>
  
<template>
  <v-card class="pa-4 rounded-lg h-30" max-width="350">
    <!-- Título -->
    <v-row justify="start" class="mb-2 ml-2">
      <h3 class="text-h6 font-weight-bold">Agenda</h3>
    </v-row>

    <!-- Encabezado del calendario -->
    <div class="calendar-header d-flex align-center justify-space-between mb-3 px-4 py-3">
      <v-btn icon class="nav-btn" @click="prevMonth">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <div class="d-flex align-center">
        <div class="calendar-chip mr-2">{{ monthName }}</div>
        <div class="calendar-chip">{{ currentYear }}</div>
      </div>

      <v-btn icon class="nav-btn" @click="nextMonth">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <!-- Encabezados de semana -->
    <v-row dense class="text-center">
      <v-col
  v-for="day in daysOfWeek"
  :key="day"
  class="font-weight-medium text-caption day-header"
>
  {{ day }}
</v-col>
    </v-row>

    <!-- Matriz de días -->
    <v-row
      v-for="(week, index) in calendarMatrix"
      :key="index"
      dense
      no-gutters
      class="justify-center"
    >
      <v-col
        v-for="day in week"
        :key="day.date"
        cols="auto"
        class="pa-1 text-center"
        style="width: 40px; height: 40px"
      >
        <div
          class="calendar-cell"
          :class="{
            'other-month': day.date.getMonth() !== currentMonth,
            'normal': isEvent(day.date, 'normal'),
            'baja': isEvent(day.date, 'baja'),
            'alta': isEvent(day.date, 'alta')
          }"
        >
          {{ day.date.getDate() }}
        </div>
      </v-col>
    </v-row>

    <!-- Leyenda de prioridad -->
    <v-row class="mt-4 align-center justify-center">
      <span class="text-grey text-subtitle-2 mr-2">Prioridad</span>

      <div class="priority-pill normal">Normal</div>
      <div class="priority-pill baja">Baja</div>
      <div class="priority-pill alta">Alta</div>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

const events = {
  normal: ['2025-05-07', '2025-05-10'],
  baja: ['2025-05-11'],
  alta: ['2025-05-20']
}

const monthName = computed(() =>
  new Date(currentYear.value, currentMonth.value).toLocaleDateString('es-MX', {
    month: 'long'
  })
)

const calendarMatrix = computed(() => {
  const matrix = []
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const startDay = (firstDayOfMonth.getDay() + 6) % 7
  const current = new Date(currentYear.value, currentMonth.value, 1 - startDay)

  for (let week = 0; week < 6; week++) {
    const row = []
    for (let i = 0; i < 7; i++) {
      row.push({ date: new Date(current) })
      current.setDate(current.getDate() + 1)
    }
    matrix.push(row)
  }

  return matrix
})

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const isEvent = (date, type) => {
  const dateStr = date.toISOString().split('T')[0]
  return events[type].includes(dateStr)
}
</script>

<style scoped>
/* Encabezado */
.calendar-header {
  background-color: #f5f5f5;
  border-radius: 16px;
}

.calendar-chip {
  background-color: white;
  border-radius: 8px;
  padding: 4px 12px;
  font-weight: 700;
  font-size: 16px;
  text-transform: capitalize;
}

.nav-btn {
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Celdas del calendario */
.calendar-cell {
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
  background-color: white;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s ease-in-out;
}

.calendar-cell.other-month {
  color: #ccc;
  background-color: #f0f0f0;
}

.calendar-cell.normal {
  background-color: #0050ff;
  color: white;
}
.day-header {
  width: 40px;
  height: 36px;
  text-align: center;
  line-height: 36px;
}

.calendar-cell.baja {
  background-color: #ffb800;
  color: white;
}

.calendar-cell.alta {
  background-color: #ff2c00;
  color: white;
}

/* Prioridades estilo pill */
.priority-pill {
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  margin-left: 8px;
  min-width: 60px;
  text-align: center;
  display: inline-block;
}

.priority-pill.normal {
  background-color: #0050ff;
}

.priority-pill.baja {
  background-color: #ffb800;
}

.priority-pill.alta {
  background-color: #ff2c00;
}
</style>

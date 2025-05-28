<template>
  <v-card class="agenda-card" elevation="2">
    <div class="agenda-inner">
      <!-- Título -->
      <h3 class="text-h6 font-weight-bold mb-4">Agenda</h3>

      <!-- Encabezado -->
      <div class="calendar-header">
        <v-btn icon class="nav-btn" @click="prevMonth">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <div class="calendar-title">
          <span class="calendar-chip text-capitalize">{{ monthName }}</span>
          <span class="calendar-chip">{{ currentYear }}</span>
        </div>

        <v-btn icon class="nav-btn" @click="nextMonth">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- Encabezado días de semana -->
      <div class="weekdays">
        <div v-for="day in daysOfWeek" :key="day" class="weekday">
          {{ day }}
        </div>
      </div>

      <!-- Matriz de días -->
      <div class="calendar-days">
        <div
          v-for="(day, index) in calendarMatrix"
          :key="index"
          class="day-cell"
          :class="{
            'other-month': day.isOtherMonth,
            'normal': isEvent(day.date, 'normal'),
            'baja': isEvent(day.date, 'baja'),
            'alta': isEvent(day.date, 'alta')
          }"
        >
          {{ day.date.getDate() }}
        </div>
      </div>

      <!-- Leyenda -->
      <div class="priority-legend mt-3">
        <span class="text-grey text-subtitle-2">Prioridad</span>
        <div class="priority-pill normal">Normal</div>
        <div class="priority-pill baja">Baja</div>
        <div class="priority-pill alta">Alta</div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
const events = ref({
  normal: [],
  baja: [],
  alta: []
})

const monthName = computed(() =>
  new Date(currentYear.value, currentMonth.value).toLocaleDateString('es-MX', {
    month: 'long'
  })
)

const calendarMatrix = computed(() => {
  const matrix = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const startDay = (firstDay.getDay() + 6) % 7
  const current = new Date(currentYear.value, currentMonth.value, 1 - startDay)

  for (let i = 0; i < 42; i++) {
    matrix.push({
      date: new Date(current),
      isOtherMonth: current.getMonth() !== currentMonth.value
    })
    current.setDate(current.getDate() + 1)
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
  return events.value[type]?.includes(dateStr)
}

const fetchEvents = async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    if (!usuario || !usuario.id) {
      console.error('Usuario no encontrado en localStorage')
      return
    }

    const response = await fetch('http://localhost:3000/api/usuarios/getTickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: usuario.id })
    })

    const data = await response.json()
    const grouped = {
      normal: [],
      baja: [],
      alta: []
    }

    data.forEach(ticket => {
      const fecha = new Date(ticket.fecha_vencimiento).toISOString().split('T')[0]
      const prioridad = ticket.prioridad?.toLowerCase()

      console.log('Ticket recibido:', { prioridad, fecha })

      if (prioridad === 'normal') grouped.normal.push(fecha)
      else if (prioridad === 'baja') grouped.baja.push(fecha)
      else if (prioridad === 'alta') grouped.alta.push(fecha)
    })

    // Evento de prueba visible (BORRAR después de confirmar que todo funciona)
    grouped.normal.push(new Date().toISOString().split('T')[0])

    events.value = grouped
    console.log('Eventos agrupados:', events.value)
  } catch (err) {
    console.error('Error al cargar eventos:', err)
  }
}

onMounted(() => {
  fetchEvents()
})
</script>


<style scoped>
.agenda-card {
  height: 100%;
  width: 100%;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0;
}

.agenda-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  overflow: hidden;
}

.calendar-header {
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.calendar-title {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.calendar-chip {
  background-color: white;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
}

.nav-btn {
  background-color: white;
  border-radius: 50%;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  margin: 10px 0 6px;
}

.weekday {
  text-align: center;
  line-height: 1.5;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 6px;
  flex-grow: 1;
  overflow-y: auto;
}

.day-cell {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  background-color: #fff;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s ease-in-out;
  box-sizing: border-box;
}

.day-cell.other-month {
  background-color: #f0f0f0;
  color: #ccc;
}

.day-cell.normal {
  background-color: #0050ff;
  color: white;
}

.day-cell.baja {
  background-color: #ffb800;
  color: white;
}

.day-cell.alta {
  background-color: #ff2c00;
  color: white;
}

.priority-legend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 14px;
  margin-top: auto;
  padding-top: 10px;
}

.priority-pill {
  border-radius: 999px;
  padding: 4px 12px;
  color: white;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
  font-size: 13px;
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

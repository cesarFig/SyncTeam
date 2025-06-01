<template>
  <v-container fluid class="pa-3 pt-1 dashboard-wrapper">
    <v-row class="dashboard-grid" align="stretch" justify="center" no-gutters>
      <!-- Título y Tabs -->
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-2">Estadisticas de tickets</h2>
        <v-tabs v-model="tab" color="primary" class="mb-4">
          <v-tab value="semanal">Semanales</v-tab>
          <v-tab value="mensual">Mes</v-tab>
        </v-tabs>
      </v-col>

      <!-- Gráfica principal -->
      <v-col cols="12" lg="8" class="pa-2">
        <v-sheet elevation="1" class="pa-2 fill-height">
          <LineChart :chart-data="lineChartData" :chart-options="lineChartOptions" />
        </v-sheet>
      </v-col>

      <!-- Progreso Semanal (SIEMPRE visible) -->
      <v-col cols="12" lg="4" class="pa-2">
        <v-card class="pa-4 fill-height d-flex flex-column justify-center align-center">
          <p class="text-subtitle-1 font-weight-medium">Progreso semanal</p>
          <p class="text-caption grey--text">{{ rangoFechas }}</p>
          <div class="progress-container mt-4">
            <svg width="110" height="110" class="progress-ring">
              <!-- Círculo gris -->
              <circle
                cx="55"
                cy="55"
                r="49"
                stroke="#e0e0e0"
                stroke-width="12"
                fill="transparent"
              />
              <!-- Círculo de progreso -->
              <circle
                cx="55"
                cy="55"
                r="49"
                stroke="#4CAF50"
                stroke-width="12"
                fill="transparent"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                stroke-linecap="round"
                transform="rotate(-90 55 55)"
                class="progress-circle"
              />
            </svg>
            <div class="progress-text">
              <strong class="text-green text-h6">{{ porcentajeSemana }}%</strong>
            </div>
          </div>
          <div class="text-caption text-center mt-2">Tickets completados</div>
        </v-card>
      </v-col>

      <!-- Tarjetas resumen -->
      <v-col cols="6" sm="4" md="2" v-for="item in resumen" :key="item.label" class="pa-1">
        <v-card :color="item.color" dark class="pa-3 text-center fill-height">
          <div class="text-h6 font-weight-bold">{{ item.valor }}</div>
          <div class="text-caption">{{ item.label }}</div>
        </v-card>
      </v-col>

      <!-- Detalles inferiores -->
      <v-col cols="12" md="4" class="pa-2" v-for="(info, index) in detalles" :key="index">
        <v-card class="pa-4 fill-height d-flex flex-column justify-center">
          <div class="text-subtitle-1">{{ info.titulo }}</div>
          <div class="text-h6 font-weight-bold">{{ info.valor() }}</div>
          <div :class="`text-caption ${info.color}`">{{ info.extra }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import axios from 'axios';
import LineChart from '../components/LineChart.vue';

const tab = ref('semanal'); // Tab por defecto

// Datos generales de tickets
const resumen = ref([
  { label: 'Tickets totales', valor: 0, color: 'deep-purple accent-4' },
  { label: 'Pendientes revisión', valor: 0, color: 'pink lighten-1' },   // estado 3
  { label: 'En progreso', valor: 0, color: 'indigo accent-1' },          // estado 2
  { label: 'Por hacer', valor: 0, color: 'cyan lighten-2' },             // estado 1
  { label: 'Completados', valor: 0, color: 'green accent-3' },           // estado 4
]);

const resumenEstado = ref({
  completados: 0,
  promedio: 0,
  completadosPrevios: 0
});

const porcentajeSemana = ref(0);
const rangoFechas = ref('');

// SVG circular progress
const circumference = 2 * Math.PI * 49;
const strokeDashoffset = computed(() => {
  const progress = porcentajeSemana.value / 100;
  return circumference - (progress * circumference);
});

// Información de tarjetas inferiores
const detalles = ref([
  {
    titulo: 'Tickets completados',
    valor: () => resumenEstado.value.completados,
    extra: computed(() => {
      const diferencia = resumenEstado.value.completados - resumenEstado.value.completadosPrevios;
      const signo = diferencia >= 0 ? '+' : '-';
      return `${signo}${Math.abs(diferencia)} respecto a la semana pasada`;
    }),
    color: computed(() => {
      const diferencia = resumenEstado.value.completados - resumenEstado.value.completadosPrevios;
      return diferencia >= 0 ? 'text-success' : 'text-error';
    })
  },
  {
    titulo: 'Tiempo promedio de entrega',
    valor: () => `${resumenEstado.value.promedio} hrs`,
    extra: '02- hrs menos que la semana anterior',
    color: 'text-error'
  },
  {
    titulo: 'Pautas completadas',
    valor: () => '4',
    extra: '1+ más que la semana anterior',
    color: 'text-success'
  }
]);

// Gráfica lineal
const lineChartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Completados',
      data: [],
      borderColor: '#42A5F5',
      backgroundColor: 'rgba(66, 165, 245, 0.2)',
      tension: 0.4,
      fill: true,
    },
  ]
});

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 50,
      ticks: { stepSize: 5 }
    },
    x: {
      ticks: { autoSkip: false }
    }
  }
};

// Gráfica según tab (semanal/mensual)
async function cargarGrafica() {
  try {
    const res = await axios.get(`http://localhost:3001/api/dashboard/resumen?modo=${tab.value}`);
    const data = res.data;
    lineChartData.value.labels = data.ticketsPorPeriodo.map(e => e.etiqueta);
    lineChartData.value.datasets[0].data = data.ticketsPorPeriodo.map(e => parseInt(e.count));
  } catch (err) {
    console.error('Error al cargar la gráfica:', err);
  }
}

// Carga de resumen semanal
async function cargarResumen() {
  try {
    const res = await axios.get(`http://localhost:3001/api/dashboard/resumen?modo=semanal`);
    const data = res.data;

    resumen.value[0].valor = data.totalTickets;
    resumen.value[1].valor = getValorEstado(data.ticketsPorEstado, 3);
    resumen.value[2].valor = getValorEstado(data.ticketsPorEstado, 2);
    resumen.value[3].valor = getValorEstado(data.ticketsPorEstado, 1);
    resumen.value[4].valor = getValorEstado(data.ticketsPorEstado, 4);

    resumenEstado.value.completados = getValorEstado(data.ticketsPorEstado, 4);
    resumenEstado.value.promedio = data.tiempoPromedio;
    resumenEstado.value.completadosPrevios = data.completadosSemanaAnterior || 0;

    porcentajeSemana.value = data.porcentajeSemana || 0;
    rangoFechas.value = data.rangoFechas || '';
  } catch (err) {
    console.error('Error al cargar resumen:', err);
  }
}

watch(tab, cargarGrafica);
onMounted(() => {
  cargarGrafica();
  cargarResumen();
});

function getValorEstado(array, estadoNumero) {
  const encontrado = array.find(e => parseInt(e.estado) === estadoNumero);
  return encontrado ? parseInt(encontrado.count) : 0;
}
</script>


<style scoped>
.dashboard-wrapper {
  background-color: #f5f7fb;
  height: 100vh;
  overflow-x: auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-top: 6px !important;
}

.dashboard-grid {
  flex-grow: 1;
  flex-wrap: wrap;
}

.progress-container {
  position: relative;
  display: inline-block;
}

.progress-ring {
  transform: rotate(0deg);
}

.progress-circle {
  transition: stroke-dashoffset 0.5s ease-in-out;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

canvas {
  max-height: 220px;
  height: 220px !important;
}

@media (max-width: 960px) {
  .dashboard-wrapper {
    height: auto;
  }
}
</style>

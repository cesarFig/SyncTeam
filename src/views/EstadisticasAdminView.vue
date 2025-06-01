<template>
  <v-container fluid class="pa-3 pt-1 dashboard-wrapper">
    <h2 class="text-h5 font-weight-bold mb-2 mt-4">Estadísticas de tickets</h2>

    <v-row class="dashboard-grid" align="stretch" justify="center" no-gutters>


      <!-- Título y Tabs -->
      <v-col cols="12">

        <v-tabs v-model="tab" color="primary" class="mb-4">
          <v-tab value="semanal">Semanales</v-tab>
          <v-tab value="mensual">Mes</v-tab>
        </v-tabs>
      </v-col>

      <!-- Gráfica principal -->
      <v-col cols="12" lg="8" class="pa-2">
        <v-sheet elevation="1" class="pa-2 fill-height" rounded="xl">
          <LineChart :chart-data="lineChartData" :chart-options="lineChartOptions" />
        </v-sheet>
      </v-col>

      <!-- Progreso Semanal -->
      <v-col cols="12" lg="4" class="pa-2">
        <v-card class="pa-4 fill-height d-flex flex-column justify-center align-center" rounded="xl">
          <p class="text-subtitle-1 font-weight-medium">Progreso semanal</p>
          <p class="text-caption grey--text">{{ rangoFechas }}</p>
          <div class="progress-container mt-4">
            <svg width="110" height="110" class="progress-ring">
              <circle cx="55" cy="55" r="49" stroke="#e0e0e0" stroke-width="12" fill="transparent" />
              <circle cx="55" cy="55" r="49" stroke="#4CAF50" stroke-width="12" fill="transparent"
                :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashoffset" stroke-linecap="round"
                transform="rotate(-90 55 55)" class="progress-circle" />
            </svg>
            <div class="progress-text">
              <strong class="text-green text-h6">{{ porcentajeSemana }}%</strong>
            </div>
          </div>
          <div class="text-caption text-center mt-2">Tickets completados</div>
        </v-card>
      </v-col>

      <!-- Wrapper para Tarjetas resumen -->
      <v-col cols="12" class="py-0 px-1">
        <v-row no-gutters justify="center">
          <!-- Tarjetas resumen -->
          <v-col cols="12" sm="6" md="4" lg="2.4" v-for="item in resumen" :key="item.label" class="pa-1 d-flex">
            <div :class="['ticket-box', item.gradientClass, 'flex-grow-1']">
              <v-icon size="28" class="mr-2">{{ item.icon }}</v-icon>
              <div class="ticket-data-container"> <!-- Added class -->
                <div class="count">{{ item.valor }}</div>
                <div class="label">{{ item.label }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>

      <!-- Wrapper para Detalles inferiores -->
      <v-col cols="12" class="py-0 px-1 mt-1"> <!-- Added mt-1 for spacing -->
        <v-row no-gutters justify="center">
          <!-- Detalles inferiores -->
          <v-col cols="12" md="4" class="pa-2" v-for="(info, index) in detalles" :key="index">
            <v-card class="pa-4 fill-height d-flex flex-row align-center" rounded="xl">
              <img
                v-if="info.imageSrc()"
                :src="info.imageSrc()"
                alt=""
                class="mr-4"
                style="max-width:100px; max-height:100px;"
              />
              <div class="flex-grow-1 text-center">
                <div class="text-subtitle-1 mb-1">{{ info.titulo }}</div>
                <div class="text-h5 font-weight-bold mb-1">{{ info.valor() }}</div>
                <div :class="['text-caption', info.color]">{{ info.extra }}</div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import axios from 'axios';
import LineChart from '../components/LineChart.vue';
import vectorMejora from '@/assets/VectorMejora.png';
import vectorReduccion from '@/assets/VectorReduccion.png';

const tab = ref('semanal');

const resumen = ref([
  { label: 'ㅤTickets totales', valor: 0, gradientClass: 'purple', icon: 'mdi-check-circle' },
  { label: 'ㅤPendientes revisión', valor: 0, gradientClass: 'magenta', icon: 'mdi-email-open' },
  { label: 'ㅤEn progreso', valor: 0, gradientClass: 'blue', icon: 'mdi-progress-clock' },
  { label: 'ㅤPor hacer', valor: 0, gradientClass: 'cyan', icon: 'mdi-bell-ring' },
  { label: 'ㅤCompletados', valor: 0, gradientClass: 'green', icon: 'mdi-check-decagram' },
]);

const resumenEstado = ref({
  completados: 0,
  promedio: 0,
  completadosPrevios: 0,
  pautas: 0,
  pautasPrevias: 0
});

const porcentajeSemana = ref(0);
const rangoFechas = ref('');

const circumference = 2 * Math.PI * 49;
const strokeDashoffset = computed(() => {
  const progress = porcentajeSemana.value / 100;
  return circumference - (progress * circumference);
});

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
    }),
    imageSrc: () => {
      const diferencia = resumenEstado.value.completados - resumenEstado.value.completadosPrevios;
      if (diferencia > 0) return vectorMejora;
      if (diferencia < 0) return vectorReduccion;
      return null;
    }
  },
  {
    titulo: 'Pautas completadas',
    valor: () => resumenEstado.value.pautas,
    extra: computed(() => {
      const diferencia = resumenEstado.value.pautas - resumenEstado.value.pautasPrevias;
      const signo = diferencia >= 0 ? '+' : '-';
      return `${signo}${Math.abs(diferencia)} respecto al mes anterior`;
    }),
    color: computed(() => {
      const diferencia = resumenEstado.value.pautas - resumenEstado.value.pautasPrevias;
      return diferencia >= 0 ? 'text-success' : 'text-error';
    }),
    imageSrc: () => {
      const diferencia = resumenEstado.value.pautas - resumenEstado.value.pautasPrevias;
      if (diferencia > 0) return vectorMejora;
      if (diferencia < 0) return vectorReduccion;
      return null;
    }
  }
]);

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
    y: { beginAtZero: true, min: 0, max: 50, ticks: { stepSize: 5 } },
    x: { ticks: { autoSkip: false } }
  }
};

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
    resumenEstado.value.completadosPrevios = data.completadosSemanaAnterior || 0;
    resumenEstado.value.pautas = data.pautas || 0;
    resumenEstado.value.pautasPrevias = data.pautasPrevias || 0;

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

/* Copied styles from ResumentTicketsAdmin.vue */
.ticket-box {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 16px;
  color: white;
  font-weight: bold;
  min-height: 56px;
  /* Adjusted to ensure consistency */
  height: 100%;
  /* Make it fill the v-col height */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  /* Ensure padding is included in height */
}

.ticket-data-container {
  display: flex;
  flex-direction: row;
  /* Ensure items are in a row */
  align-items: baseline;
  /* Align items by their text baseline */
  justify-content: flex-start;
  /* Align items to the start of the container */
  flex-grow: 1;
  /* Allow it to take available space next to the icon */
}

.count {
  font-size: 25px;
  /* Adjusted to match ResumentTicketsAdmin, was text-h6 */
  margin-right: 5px;
  /* Add some space between count and label */
}

.label {
  font-size: 20px;
  /* Adjusted to match ResumentTicketsAdmin, was text-caption */
  line-height: 1.2;
}

.purple {
  background: linear-gradient(to right, #7b1fa2, #B14CF4);
}

.magenta {
  background: linear-gradient(to right, #B5179F, #E048CB);
}

.blue {
  background: linear-gradient(to right, #546FFF, #889BFF);
}

.cyan {
  background: linear-gradient(to right, #4BC9F1, #89E3FF);
}

.green {
  background: linear-gradient(to right, #43a047, #4DC17B);
}


@media (max-width: 960px) {
  .dashboard-wrapper {
    height: auto;
  }
}
</style>

<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */

import { onMounted, ref, watch } from 'vue'
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler
} from 'chart.js'

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Tooltip, Filler)

const props = defineProps({
  chartData: Object,
  chartOptions: Object
})

const canvas = ref(null)
let chartInstance = null

onMounted(() => {
  if (canvas.value) {
    chartInstance = new Chart(canvas.value, {
      type: 'line',
      data: props.chartData,
      options: props.chartOptions
    })
  }
})

watch(() => props.chartData, (newData) => {
  if (chartInstance) {
    chartInstance.data = newData
    chartInstance.update()
  }
}, { deep: true })
</script>


<style scoped>
canvas {
  width: 100% !important;
  height: auto !important;
}
</style>

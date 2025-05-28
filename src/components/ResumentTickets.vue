<template>
  <div class="resumen-tickets">
    <div class="ticket-box purple">
      <v-icon size="28" class="mr-2">mdi-check-circle</v-icon>
      <div>
        <div class="count">305</div>
        <div class="label">Tickets totales</div>
      </div>
    </div>

    <div class="ticket-box magenta">
      <v-icon size="28" class="mr-2">mdi-email-open</v-icon>
      <div>
        <div class="count">10</div>
        <div class="label">Pendientes<br>revisión</div>
      </div>
    </div>

    <div class="ticket-box blue">
      <v-icon size="28" class="mr-2">mdi-progress-clock</v-icon>
      <div>
        <div class="count">07</div>
        <div class="label">En progreso</div>
      </div>
    </div>

    <div class="ticket-box cyan">
      <v-icon size="28" class="mr-2">mdi-bell-ring</v-icon>
      <div>
        <div class="count">43</div>
        <div class="label">Pendientes</div>
      </div>
    </div>

    <div class="ticket-box green">
      <v-icon size="28" class="mr-2">mdi-check-decagram</v-icon>
      <div>
        <div class="count">255</div>
        <div class="label">Completados</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Nada por ahora
</script>

<style scoped>
.resumen-tickets {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin; /* para navegadores que lo soportan */
}

.ticket-box {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 16px;
  color: white;
  font-weight: bold;
  min-height: 56px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.count {
  font-size: 20px;
}

.label {
  font-size: 13px;
  line-height: 1.2;
}

/* Colores personalizados */
.purple {
  background: linear-gradient(to right, #7b1fa2, #9c27b0);
}
.magenta {
  background: linear-gradient(to right, #c2185b, #e91e63);
}
.blue {
  background: linear-gradient(to right, #1976d2, #42a5f5);
}
.cyan {
  background: linear-gradient(to right, #00acc1, #4dd0e1);
}
.green {
  background: linear-gradient(to right, #43a047, #66bb6a);
}
</style>

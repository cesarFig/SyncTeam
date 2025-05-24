<template>
  <v-container fluid>
    <!-- Fila con calendario y notificaciones -->
    <v-row class="mb-6" align="stretch">
      <v-col cols="12" md="6" lg="5">
        <CalendarioCard />
      </v-col>
      <v-col cols="12" md="6" lg="5">
        <CardNotificaciones />
      </v-col>
    </v-row>

    <!-- Fila con tarjetas de tickets -->
    <v-row justify="start">
      <v-col cols="12" md="10" lg="8">
        <CardTicketDashboard />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import CalendarioCard from '@/components/CalendarioCard.vue'
import CardNotificaciones from '@/components/CardNotificaciones.vue'
import CardTicketDashboard from '@/components/CardTicketsDashboard.vue'
</script>

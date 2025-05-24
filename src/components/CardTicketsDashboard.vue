<template>
  <v-container fluid>    
 <v-col cols="15" md="17" lg="10">

        <v-card class="pa-6 rounded-xl" elevation="2">
          <!-- Título -->
          <h3 class="text-h6 font-weight-bold mb-6">Tickets próximos</h3>

          <!-- Las dos tarjetas en una fila -->
          <v-row dense>
            <v-col cols="12" sm="6" class="pa-0 pr-2">
              <CardTicket
                :titulo="'Retocar sesión fotográfica'"
                :descripcion="'Pauta: Promo Adidas Junio25'"
                :imagen="AdidasPromo"
                :fecha_vencimiento="'2025-04-10'"
                :estado="3"
                :nombre_categoria="'Diseño'"
                :color_rgb="'#0050FF'"
              />
            </v-col>

            <v-col cols="12" sm="6" class="pa-0 pl-2">
              <CardTicket
                :titulo="'Crear banner para Web'"
                :descripcion="'Pauta: Banner ITM Web page'"
                :imagen="AdidasPromo"
                :fecha_vencimiento="'2025-04-11'"
                :estado="2"
                :nombre_categoria="'Marketing'"
                :color_rgb="'#FFC107'"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>    
  </v-container>
</template>

<script setup>
import CardTicket from '@/components/CardTicket.vue'
import AdidasPromo from '@/assets/imagenAdidas.png'
</script>

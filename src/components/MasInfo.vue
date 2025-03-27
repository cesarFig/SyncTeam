<template>
  <v-container fluid class="pa-0 relative">
    <v-img src="@/assets/fondo.png" height="200" cover></v-img>

    <!-- Tarjeta de Ajustes -->
    <v-card class="card1" max-width="100%">
      <v-container class="pa-1">
        <v-row align="center" class="mt-0">
          <v-col cols="auto" class="pt-0">
            <v-avatar size="100" class="avatar-overlap">
              <v-img src="@/assets/policia.jpg" alt="Perfil"/>
            </v-avatar>
          </v-col>
          <v-card-title class="text-h5 font-weight-bold pl-0 pt-0 mt-0">Ajustes</v-card-title>
          <v-spacer></v-spacer>
          <v-col cols="auto" class="pt-0">
            <v-btn variant="outlined" class="btnCancelar">Cancelar</v-btn>
            <v-btn color="#B5179F" class="btnGuardar">Guardar</v-btn>
          </v-col>
        </v-row>

        <v-tabs v-model="tab">
          <v-tab class="tabs">Mi información</v-tab>
          <v-tab>Notificaciones</v-tab>
          <v-tab>App</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item>
            <v-form class="pt-0">
              <v-row class="mt-2">
                <v-col cols="4" class="pt-0">
                  <label class="custom-label" style="font-family: poppins; margin-bottom: 10px; display: block;">Nombre</label>
                  <v-text-field density="compact" variant="outlined" v-model="nombre" class="rounded-field"/>
                </v-col>
                <v-col cols="4" class="pt-0">
                  <label class="custom-label" style="font-family: poppins; margin-bottom: 10px; display: block;">Apellido</label>
                  <v-text-field density="compact" variant="outlined" v-model="apellido" class="rounded-field"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="7">
                  <label class="custom-label" style="font-family: poppins; margin-bottom: 10px; display: block;">Email</label>
                <v-text-field density="compact" variant="outlined" prepend-inner-icon="mdi-email" v-model="email" class="rounded-field"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="7">
                  <label class="custom-label" style="font-family: poppins; margin-bottom: 10px; display: block;">Rol</label>
                  <v-text-field variant="outlined" v-model="rol" class="rounded-field"/>
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>

          <v-window-item>
            <v-row class="mt-0">
              <v-col cols="12" class="pt-0">
                <v-switch color="#B5179F" v-model="notificaciones.alertaRevision" label="Alerta tickets revisión" />
                <v-switch v-model="notificaciones.actualizacionTickets" label="Actualización de tickets" color="#B5179F"/>
                <v-switch v-model="notificaciones.alertaRetrasados" label="Alerta tickets retrasados" color="#B5179F"/>
                <v-switch v-model="notificaciones.sonido" label="Notificaciones con sonido" color="#B5179F"/>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item>
            <v-row class="mt-0">
              <v-col cols="5" class="pa-0 pt-2">
                <label class="custom-label" style="font-family: poppins; margin-left: 15px; margin-bottom: 10px; display: block;">Lenguaje</label>
                <v-select
                  v-model="appConfig.idioma"
                  :items="idiomas"             
                  density="comfortable"
                  variant="outlined"  
                  class="select"              
                />
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="5" class="pa-0 pt-2">
                <label class="custom-label" style="font-family: poppins; margin-left: 15px; margin-bottom: 10px; display: block;">Zona horaria</label>
                <v-select
                  v-model="appConfig.zonaHoraria"
                  :items="zonasHorarias"                  
                  variant="outlined"
                  class="select"
                />
              </v-col>
            </v-row>
            <v-row class="mt-2 mb-2">
              <v-col cols="12" class="pa-0 pt-2">
                <p class="text-body-1 font-weight-medium" style="margin-left: 15px !important;">Formato de hora</p>
                <v-btn-toggle v-model="appConfig.formatoHora"  group>
                  <v-btn  class="custom-btn" :value="'24h'">24 Horas</v-btn>
                  <v-btn class="custom-btn" :value="'12h'">Horas</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>      
          </v-window-item>
        </v-window>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      tab: 0,
      nombre: "Cesar",
      apellido: "Figueroa",
      email: "cesarfigueee777@gmail.com",
      rol: "Creativo",
      notificaciones: {
        alertaRevision: true,
        actualizacionTickets: false,
        alertaRetrasados: true,
        sonido: false
      },
      appConfig: {
        idioma: "Español (México)",
        zonaHoraria: "CDMX (GMT-6)",
        formatoHora: "24h"
      },
      idiomas: ["Español (México)", "Inglés (US)", "Francés", "Alemán"],
      zonasHorarias: ["CDMX (GMT-6)", "Nueva York (GMT-5)", "Madrid (GMT+1)", "Tokio (GMT+9)"]
    };
  }
};
</script>

<style>
.relative {
  position: relative;
}

.v-avatar{
  border: 6px solid white !important;
}
.card1 {
  padding-top: 0 !important;
  margin-top: -50px !important;
  border-radius: 12px 12px 0 0 !important;
  box-shadow: none !important;
  overflow: visible !important;
}

.card1 .v-container {
  padding-top: 0 !important;
}

.card1 .v-row:first-child {
  margin-top: 0 !important;
}

.card1 .v-col:first-child {
  padding-top: 0 !important;
}

.rounded-field .v-field__outline {
  border-radius: 9px !important;
  border: 1px solid gray !important;
}

.rounded-field {
  color: gray;
}

.v-tab__slider {
  display: none !important;
}

.v-tab {
  justify-content: flex-start !important;
  text-align: left !important;
  padding-left: 0 !important;
  padding-right: 6% !important;
}
.v-avatar{
  margin-top: -40px !important;  
}

.custom-label {
  font-family: 'Poppins', sans-serif;
  margin-bottom: 10px;
  display: block;
}
.select{
  margin-top:10px !important ;
  margin-left: 13px !important;
}
.btnCancelar{
  margin-right: 15px ;
  border-color: gray;
  font-family: poppins;  
  border-radius: 10px !important;
}
.btnGuardar{
  font-family: poppins;  
  border-radius: 10px !important;
}
.v-select .v-field__outline {
  display: none !important;
}
.custom-btn {
  border: 2px solid transparent !important;
  transition: all 0.3s ease !important;
  border-radius: 14px !important;
  margin-left: 15px !important;  
}

.custom-btn:hover {
  border-color: rgba(181, 23, 159, 0.5) !important;
}

.custom-btn:active,
.custom-btn:focus {
  border-color: #B5179F !important;  
}
</style>
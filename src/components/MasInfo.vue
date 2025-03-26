<template>
  <v-container fluid class="pa-0">
    <!-- Sección superior con fondo -->
    <v-sheet height="200" class="bg-gradient"></v-sheet>

    <!-- Tarjeta de Ajustes -->
    <v-card class="pa-5" max-width="100%" flat>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">            
            <v-row align="center">
              <v-col cols="auto">
                <v-avatar size="80">
                  <v-img src="@/assets/policia.jpg" alt="Perfil"/>
                </v-avatar>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <v-btn variant="outlined" class="mr-2">Cancelar</v-btn>
                <v-btn color="primary">Guardar</v-btn>
              </v-col>
            </v-row>

            <!-- Título -->
            <v-card-title class="text-h5 font-weight-bold">Ajustes</v-card-title>
            
            <v-tabs v-model="tab">
              <v-tab>Mi información</v-tab>
              <v-tab>Notificaciones</v-tab>
              <v-tab>App</v-tab>
            </v-tabs>

            <v-divider></v-divider>
            
            <v-window v-model="tab">              
              <v-window-item>
                <v-form>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field label="Primer nombre" v-model="nombre" />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="Apellido" v-model="apellido" />
                    </v-col>
                  </v-row>
                  <v-text-field label="Email" prepend-inner-icon="mdi-email" v-model="email" />
                  <v-text-field label="Rol" v-model="rol" readonly />
                </v-form>
              </v-window-item>
              
              <v-window-item>
                <v-row>
                  <v-col cols="12">
                    <v-switch v-model="notificaciones.alertaRevision" label="Alerta tickets revisión" color="primary" />
                    <v-switch v-model="notificaciones.actualizacionTickets" label="Actualización de tickets" />
                    <v-switch v-model="notificaciones.alertaRetrasados" label="Alerta tickets retrasados" color="primary" />
                    <v-switch v-model="notificaciones.sonido" label="Notificaciones con sonido" />
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Pestaña de App -->
              <v-window-item>
                <v-row>
                  <v-col cols="12" class="pa-6">
                    <v-select
                      v-model="appConfig.idioma"
                      :items="idiomas"
                      label="Lenguaje"
                      density="comfortable"                      
                      variant="outlined"
                    />
                  </v-col>

                  <v-col cols="12" class="pa-6">
                    <v-select
                      v-model="appConfig.zonaHoraria"
                      :items="zonasHorarias"
                      label="Zona horaria"
                      variant="outlined"
                    />
                  </v-col>

                  <v-col cols="12" class="pa-6">
                    <p class="text-body-1 font-weight-medium">Formato de hora</p>
                    <v-btn-toggle v-model="appConfig.formatoHora" color="primary" group>
                      <v-btn :value="'24h'">24 Horas</v-btn>
                      <v-btn :value="'12h'">Horas</v-btn>
                    </v-btn-toggle>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
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
      rol: "Editor de textos",
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
.bg-gradient {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}
</style>

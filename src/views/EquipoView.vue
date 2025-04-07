<template>
    <v-container>
      <h2 class="section-title">Todos los Creativos</h2>
      <v-row>
        <v-col v-for="(creativo, index) in creativos" :key="index" cols="12" sm="6" md="4" lg="3">
          <UserCard :usuario="creativo" />
        </v-col>
      </v-row>
      
      <h2 class="section-title">Copywriters</h2>
      <v-row>
        <v-col v-for="(copy, index) in copywriters" :key="index" cols="12" sm="6" md="4" lg="3">
          <UserCard :usuario="copy" />
        </v-col>
      </v-row>
      
      <h2 class="section-title">Fotografía</h2>
      <v-row>
        <v-col v-for="(foto, index) in fotografia" :key="index" cols="12" sm="6" md="4" lg="3">
          <UserCard :usuario="foto" />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import UserCard from '@/components/TarjetaCreativos.vue';
  
  export default {
    components: {
      UserCard
    },
    data() {
      return {
        creativos: [
          {
            nombre: "Merali Rodriguez",
            imagen: require("@/assets/cassy.png"),
            rol: "Editora fotográfica",
            correo: "kellyxraphy@yahoo.com",
            especialidad: "Edición digital",
            ticketsTotales: 31,
            ticketsActivos: 10,

          }
        ],
        copywriters: [
          {
            nombre: "Cesar Figueroa",
            imagen: require("@/assets/cassy.png"),
            rol: "Copys",
            correo: "carfigueroa777@gmail.com",
            ticketsTotales: 92,
            ticketsActivos: 5
          },
          {
            nombre: "German Leiva",
            imagen: require("@/assets/cassy.png"),
            rol: "Copys",
            correo: "eduardiodid55@hotmail.com",
            ticketsTotales: 102,
            ticketsActivos: 11
          },
          {
            nombre: "Kelly Reyna",
            imagen: require("@/assets/cassy.png"),
            rol: "Copys",
            correo: "kellyxphoraphy@yahoo.com",
            ticketsTotales: 31,
            ticketsActivos: 10
          }
        ],
        fotografia: [
          {
            nombre: "Armando Casanova",
            imagen: require("@/assets/cassy.png"),
            rol: "Fotógrafo",
            correo: "armandocasan5@gmail.com",
            ticketsTotales: 40,
            ticketsActivos: 12
          },
          {
            nombre: "Merali Rodriguez",
            imagen: require("@/assets/cassy.png"),
            rol: "Editora fotográfica",
            correo: "kellyxphotogray@yahoo.com",
            ticketsTotales: 31,
            ticketsActivos: 10
          }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .section-title {
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
    padding-bottom: 8px;
    border-bottom: 2px solid #b5179f;
    margin-top: 20px;
  }
  
  /* Responsive adjustments */
  @media (max-width: 600px) {
    .section-title {
      font-size: 1.3rem;
    }
  }
  </style>
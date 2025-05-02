<template>
    <v-container fluid class="login-container">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-6 login-box" elevation="10">
            <v-card-title class="text-center">
              <v-img src="@/assets/logoSyncTeam.png" contain height="100"></v-img>
              <h2 class="mt-2">Hola, Bienvenido!</h2>
            </v-card-title>
  
            <v-card-text>
              <v-form @submit.prevent="login">
                <!-- Campo de Correo -->
                <v-text-field
                  v-model="email"
                  label="Correo"
                  type="email"
                  variant="outlined"
                  required
                  class="mb-3"
                ></v-text-field> 
  
                <!-- Campo de Contraseña con botón correctamente configurado -->
                <v-text-field
                  v-model="password"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  required
                  class="mb-3"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="togglePassword"
                ></v-text-field>
  
                <!-- Botón con degradado en tonos morados -->
                <v-btn type="submit" block class="login-btn">
                  LOGIN
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        email: "",
        password: "",
        showPassword: false, 
      };
    },
    methods: {
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
      async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          correo: this.email,
          password: this.password
        });

        alert('Login exitoso');
        const usuario = {
          id: response.data.usuario.id,
          nombre: response.data.usuario.nombre,
          apellido: response.data.usuario.apellido,
          rol: response.data.usuario.rol
        };        
        localStorage.setItem('usuario', JSON.stringify(usuario));            
         switch (usuario.rol) {            
            case 'Administrador':
              this.$router.push('/dashboard-admin');
              break;
            default:
              this.$router.push('/dashboard-admin');
        }
      } catch (error) {
        alert(error.response?.data?.error || 'Error al iniciar sesión');
      }
    }
      
    },
  };
  </script>
  
  <style>
  /* Fondo ajustado correctamente */
  .login-container {
    background: url("@/assets/imgLogin.png") no-repeat center center;
    background-size: cover;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Tarjeta centrada */
  .login-box {
    border-radius: 12px;
    text-align: center;
  }
  
  /* Botón con degradado en tonos morados */
  .login-btn{
    font-size: 1rem;
    font-weight: bold;
    color: white !important;
    border-radius: 20px;
    background: linear-gradient(180deg, #8B1876, #B5179F);
    transition: 0.3s;
  }
  
  .login-btn:hover {
    opacity: 0.8;
  }
  
  h2{
    color: #435669 !important;
    font-size: 24px;
   }
  
  </style>
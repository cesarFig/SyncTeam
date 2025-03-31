<template>
    <v-container fluid class="registro-container">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-6 registro-box" elevation="10">
            <v-btn icon class="close-btn" @click="cerrar">
              <v-icon>mdi-close</v-icon>
            </v-btn>
  
            <v-card-title class="text-center">
              <v-img src="@/assets/logoSyncTeam.png" contain height="100"></v-img>
              <h2 class="mt-2">Registro</h2>
            </v-card-title>
  
            <v-card-text>
              <v-form @submit.prevent="registrarUsuario">
                <v-text-field v-model="nombre" label="Nombre" required variant="outlined" class="mb-3"></v-text-field>
                <v-text-field v-model="apellido" label="Apellido" required variant="outlined" class="mb-3"></v-text-field>
                <v-select v-model="rol" label="Rol" :items="['Escritor', 'Fotografo','Editor']" required variant="outlined" class="mb-3"></v-select>
                <v-text-field v-model="correo" label="Correo" type="email" required variant="outlined" class="mb-3"></v-text-field>
                <v-text-field v-model="password" label="Contraseña" :type="showPassword ? 'text' : 'password'" variant="outlined" required class="mb-3"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="togglePassword">
                </v-text-field>
                <v-text-field v-model="confirmPassword" label="Confirmar contraseña" :type="showConfirmPassword ? 'text' : 'password'" variant="outlined"
                  required class="mb-3" :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="toggleConfirmPassword">
                </v-text-field>
                <v-btn type="submit" block class="register-btn">REGISTRAR USUARIO</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        nombre: "",
        apellido: "",
        rol: "",
        correo: "",
        password: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
      };
    },
    methods: {
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
      toggleConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword;
      },
      registrarUsuario() {
        if (this.password !== this.confirmPassword) {
          alert("Las contraseñas no coinciden");
          return;
        }
        alert(`Registro exitoso para: ${this.nombre} ${this.apellido}`);
      },
      cerrar() {
        alert("Cerrando formulario...");
      },
    },
  };
  </script>
  
  <style scoped>
  /* ✅ SOLUCIÓN GARANTIZADA: el fondo cubrirá TODA la pantalla sin franjas blancas */
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .registro-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("@/assets/imgRegistro.png") no-repeat center center fixed;
    background-size: cover;
  }
  
  /* Ajustes a la tarjeta del formulario */
  .registro-box {
    border-radius: 20px;
    text-align: center;
  }
  
  /* Botón de cerrar */
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  
  /* ✅ Botón de registro con degradado morado */
  .register-btn {
    font-size: 1rem;
    font-weight: bold;
    color: white;
    border-radius: 20px;
    background: linear-gradient(180deg, #8B1876, #B5179F);
    transition: 0.3s;
  }
  
  .register-btn:hover {
    opacity: 0.9;
  }
  </style>
  
<template>
  <div class="form-container">
    <h2>Formulario de prueba</h2>
    <v-text-field label="Nombre" v-model="nombre" outlined></v-text-field>
    <v-text-field label="Correo" v-model="correo" outlined></v-text-field>
    <v-btn color="green" @click="enviarFormulario">Enviar</v-btn>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombre: '',
      correo: ''
    };
  },
  methods: {
    async enviarFormulario() {
      try {
        const res = await axios.post('http://localhost:3000/api/prueba', {
          nombre: this.nombre,
          correo: this.correo
        });
        console.log('Datos guardados:', res.data);
        this.nombre = '';
        this.correo = '';
      } catch (err) {
        console.error('Error al enviar:', err);
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
}
</style>

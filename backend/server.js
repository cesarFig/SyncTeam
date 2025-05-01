const express = require('express');
const dotenv = require('dotenv');
const actionsRoutes = require('./routes/actions');
const pautasRoutes = require('./routes/pautas');
const cors = require('cors');
const pruebaRoutes = require('./routes/prueba');
const ticketsPruebaRoutes = require('./routes/ticketsPrueba');
const usuariosRoutes = require('./routes/usuarios');
const loginRoutes = require('./routes/loginreal');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // Permite solicitudes desde tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use('/api/actions', actionsRoutes);
app.use('/api/pautas', pautasRoutes);
app.use('/api/prueba', pruebaRoutes);
app.use('/api/ticketsPrueba', ticketsPruebaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/login', loginRoutes);





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const express = require('express');
const dotenv = require('dotenv');
const actionsRoutes = require('./routes/actions');
const pautasRoutes = require('./routes/pautas');
const loginRoute = require('./routes/login');
const rolesRoute = require('./routes/roles');
const usuariosRoute = require('./routes/usuarios');
const addPautaRoute = require('./routes/addPauta');
const cors = require('cors');

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
app.use('/api/login', loginRoute);
app.use('/api/roles', rolesRoute);
app.use('/api/usuarios', usuariosRoute);
app.use('/api/addPauta', addPautaRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
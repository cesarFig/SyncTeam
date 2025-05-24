const express = require('express');
const dotenv = require('dotenv');
const actionsRoutes = require('./routes/actions');
const pautasRoutes = require('./routes/pautas');
const loginRoute = require('./routes/login');
const rolesRoute = require('./routes/roles');
const usuariosRoute = require('./routes/usuarios');
const addPautaRoute = require('./routes/addPauta');
const categoriaRoute = require('./routes/categorias');
const prioridadesRoute = require('./routes/prioridades');
const addTicketRoute = require('./routes/addTicket');
const addComentario = require('./routes/comentarios');
const ajustesRoutes = require('./routes/ajustes');
const asignacionRoutes = require('./routes/asignacion');
const notificacionesRoutes = require('./routes/notificaciones');
const uploadRoute = require('./routes/upload');
const cors = require('cors');
const path = require('path'); // <--- importante
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
app.use('/api/categoria', categoriaRoute);
app.use('/api/prioridades', prioridadesRoute);
app.use('/api/addTicket', addTicketRoute);
app.use('/api/comentarios', addComentario);
app.use('/api/ajustes', ajustesRoutes); 
app.use('/api', asignacionRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/upload', uploadRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
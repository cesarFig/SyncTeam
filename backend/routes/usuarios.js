const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { insertUsuario, getUsuarios, getTicketsUser, getTickets, actualizarAvatarUsuario, eliminarAvatarUsuario } = require('../db/queries');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
    const timestamp = Date.now();
    cb(null, `${name}-${timestamp}${ext}`);
  }
});
const upload = multer({ storage });

router.post('/', async (req, res) => {
    console.log('Datos recibidos:', req.body);
  try {    
    const { nombre, apellido, rol, correo, password } = req.body;

    const passwordHasheada = await bcrypt.hash(password, 10);       
    const result = await insertUsuario({ nombre, apellido, rol, correo, password: passwordHasheada });    
    res.status(201).json({ message: 'Usuario registrado', id: result.id });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});
router.get('/getUsuarios', async (req, res) => {
  try {
    const roles = await getUsuarios();
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});
router.post('/getTicket', async (req, res) => {
  const { id } = req.body; // ✅ aquí sí puedes usar req.body porque es POST
  
  try {
    const tickets = await getTicketsUser(id);
    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ error: 'Error al obtener los tickets' });
  }
});
router.post('/getTickets', async (req, res) => {
  const { id } = req.body; // ✅ aquí sí puedes usar req.body porque es POST
  try {
    const tickets = await getTickets(id);
    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ error: 'Error al obtener los tickets' });
  }
});
router.post('/actualizar-avatar', upload.single('avatar'), async (req, res) => {
  try {
    const { id } = req.body;
    const avatar = req.file?.filename;

    if (!id || !avatar) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const result = await actualizarAvatarUsuario(id, avatar);
    res.json({ ok: true, result });
  } catch (error) {
    console.error('Error al actualizar avatar:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});
router.post('/eliminar-avatar', async (req, res) => {
  const { id } = req.body;
  try {
    await eliminarAvatarUsuario(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error al eliminar avatar:', err);
    res.status(500).json({ error: 'Error al eliminar avatar' });
  }
});


module.exports = router;

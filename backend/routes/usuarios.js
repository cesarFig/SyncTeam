const express = require('express');
const router = express.Router();
const { insertUsuario, getUsuarios, getTicketsUser, getTickets } = require('../db/queries');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    console.log('Datos recibidos:', req.body);
  try {
    console.log('Aqui no hay error');
    const { nombre, apellido, rol, correo, password } = req.body;

    const passwordHasheada = await bcrypt.hash(password, 10);
    console.log('Aqui no hay error4');    
    const result = await insertUsuario({ nombre, apellido, rol, correo, password: passwordHasheada });
    console.log('Aqui no hay error5');
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


module.exports = router;

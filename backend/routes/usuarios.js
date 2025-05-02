const express = require('express');
const router = express.Router();
const { insertUsuario } = require('../db/queries');
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

module.exports = router;

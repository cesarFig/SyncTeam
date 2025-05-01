const express = require('express');
const router = express.Router();
const { insertUsuario } = require('../db/queries');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  try {
    const { nombre, apellido, rol, correo, password } = req.body;

    // Validación básica
    if (!nombre || !apellido || !rol || !correo || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Hash de la contraseña
    const passwordHasheada = await bcrypt.hash(password, 10);

    // Insertar en la base de datos
    const result = await insertUsuario({ nombre, apellido, rol, correo, password: passwordHasheada });

    res.status(201).json({ message: 'Usuario registrado', id: result.id });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

module.exports = router;

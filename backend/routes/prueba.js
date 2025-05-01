// /routes/prueba.js
const express = require('express');
const { insertPrueba } = require('../db/queries');

const router = express.Router();

// Ruta para insertar datos en la tabla 'prueba'
router.post('/', async (req, res) => {
  const { nombre, correo } = req.body;
  try {
    const result = await insertPrueba(nombre, correo);
    res.status(201).json(result); // Respondemos con el registro insertado
  } catch (error) {
    console.error('Error al insertar en prueba:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;

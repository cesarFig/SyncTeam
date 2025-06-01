const express = require('express');
const { insertPauta, updatePauta } = require('../db/queries');
const router = express.Router();

// Ruta para insertar una nueva pauta
router.post('/', async (req, res) => {
  try {
    const pauta = req.body;
    const result = await insertPauta(pauta);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al insertar pauta:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta de actualización de pauta
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await updatePauta(id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error al actualizar pauta:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;

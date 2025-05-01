const express = require('express');
const { insertPauta } = require('../db/queries');
const router = express.Router();

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

module.exports = router;

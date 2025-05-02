const express = require('express');
const router = express.Router();
const { getPrioridades } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const prioridad = await getPrioridades();
    res.json(prioridad);
  } catch (error) {    
    res.status(500).json({ error: 'Error al obtener las prioridades' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { getCategorias } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const categoria = await getCategorias();
    res.json(categoria);
  } catch (error) {    
    res.status(500).json({ error: 'Error al obtener las categorias' });
  }
});

module.exports = router;
const express = require('express');
const { obtenerUsuario } = require('../db/queries');
const router = express.Router();


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await obtenerUsuario(id);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'aqui?' });
  }
});

module.exports = router;

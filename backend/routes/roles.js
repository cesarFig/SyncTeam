const express = require('express');
const router = express.Router();
const { getRoles } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const roles = await getRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error al obtener los roles' });
  }
});

module.exports = router;

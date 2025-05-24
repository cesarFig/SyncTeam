const express = require('express');
const router = express.Router();
const { getTicket } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const ticket = await getTicket();
    res.json(ticket);
  } catch (error) {
    console.error('Error al obtener el ticket:', error);
    res.status(500).json({ error: 'Error al obtener el ticket' });
  }
});

module.exports = router;

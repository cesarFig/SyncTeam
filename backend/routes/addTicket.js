const express = require('express');
const { insertTicket } = require('../db/queries');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const ticket = req.body;
    const result = await insertTicket(ticket);
    res.status(201).json({ ticketId: result.id });
  } catch (error) {
    console.error('Error al insertar ticket:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
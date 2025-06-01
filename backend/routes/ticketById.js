const express = require('express');
const router = express.Router();
const { getTicketById } = require('../db/queries');

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await getTicketById(id);
    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ error: 'Ticket no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el ticket:', error);
    res.status(500).json({ error: 'Error al obtener el ticket' });
  }
});

module.exports = router;

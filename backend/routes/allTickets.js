const express = require('express');
const router = express.Router();
const { getAllTickets } = require('../db/queries');

// Devuelve todos los tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error al obtener todos los tickets:', error);
    res.status(500).json({ error: 'Error al obtener todos los tickets' });
  }
});

module.exports = router;

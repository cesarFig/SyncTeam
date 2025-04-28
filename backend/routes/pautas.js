const express = require('express');
const { getPautas, getTicketsByPauta } = require('../db/queries');

const router = express.Router();

// Route to fetch all pautas
router.get('/', async (req, res) => {
  try {
    const pautas = await getPautas();
    res.status(200).json(pautas);
  } catch (err) {
    res.status(500).send('Error fetching pautas');
  }
});

// Route to fetch tickets by pauta ID
router.get('/:pautaId/tickets', async (req, res) => {
  const { pautaId } = req.params;
  try {
    const tickets = await getTicketsByPauta(pautaId);
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).send('Error fetching tickets for pauta');
  }
});

module.exports = router;
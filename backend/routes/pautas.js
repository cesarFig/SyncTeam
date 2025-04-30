const express = require('express');
const { getPautas, getTicketsByPauta, getColaboradores } = require('../db/queries');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pautas = await getPautas();
    res.status(200).json(pautas);
  } catch (err) {
    res.status(500).send('Error fetching pautas');
  }
});

router.get('/:pautaId/tickets', async (req, res) => {
  const { pautaId } = req.params;
  try {
    const tickets = await getTicketsByPauta(pautaId);
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).send('Error fetching tickets for pauta');
  }
});

router.get('/:pautaId/colaboradores', async (req, res) => {
  const { pautaId } = req.params;
  try {
    const colaboradores = await getColaboradores(pautaId);
    res.status(200).json(colaboradores);
  } catch (err) {
    res.status(500).send('Error fetching colaboradores de pauta');
  }
});

module.exports = router;
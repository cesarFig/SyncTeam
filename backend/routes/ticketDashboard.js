const express = require('express');
const { obtenerProximoTicketDashboardPorUsuario } = require('../db/queries');
const router = express.Router();


router.get('/:idUser', async (req, res) => {
  const { idUser } = req.params;
  try {
    const ticketDashboard = await obtenerProximoTicketDashboardPorUsuario(idUser);
    res.json(ticketDashboard);
  } catch (err) {
    res.status(500).json({ error: 'aqui?' });
  }
});

module.exports = router;

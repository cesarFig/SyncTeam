const express = require('express');
const { getPautas, getTicketsByPauta, getColaboradores, updateTicketEstado, crearNotificacionesEstado } = require('../db/queries');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let pautas = await getPautas();
    // Ajustar URL de imagen: link: o uploads
    pautas = pautas.map(p => {
      let img = p.imagen;
      if (typeof img === 'string' && img.startsWith('link:')) {
        img = img.slice(5);
      } else if (img) {
        img = `${req.protocol}://${req.get('host')}/uploads/${img}`;
      }
      return { ...p, imagen: img };
    });
    res.status(200).json(pautas);
  } catch (err) {
    res.status(500).send('Error fetching pautas');
  }
});

router.get('/:pautaId/tickets', async (req, res) => {
  const { pautaId } = req.params;
  try {
    let tickets = await getTicketsByPauta(pautaId);
    // Ajustar URL de imagen para cada ticket
    tickets = tickets.map(t => {
      let img = t.imagen;
      if (typeof img === 'string' && img.startsWith('link:')) {
        img = img.slice(5);
      } else if (img) {
        img = `${req.protocol}://${req.get('host')}/uploads/${img}`;
      }
      return { ...t, imagen: img };
    });
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

router.put('/tickets/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  const { estado } = req.body;
  const {usuario} = req.body;

  if (!estado || estado < 1 || estado > 4) {
    return res.status(400).send('Invalid estado value');
  }

  try {
    const updatedTicket = await updateTicketEstado(ticketId, estado);
    await crearNotificacionesEstado(ticketId, usuario, estado);
    res.status(200).json(updatedTicket);
  } catch (err) {
    res.status(500).send('Error updating ticket estado');
  }
});

module.exports = router;
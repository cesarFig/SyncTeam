const express = require('express');
const router = express.Router();
const { getComentariosByTicketId, crearComentario, crearNotificacionesComentario } = require('../db/queries');

// GET comentarios por ticket_id
router.get('/:ticketId', async (req, res) => {
  try {
    const comentarios = await getComentariosByTicketId(req.params.ticketId);
    res.json(comentarios);
  } catch (err) {
   console.error('Error al obtener comentarios:', err.message || err);
    res.status(500).json({ error: err.message || 'Error al obtener comentarios' });
  }
});

// POST nuevo comentario
router.post('/', async (req, res) => {
  try {
    const { ticket_id, usuario_id, contenido } = req.body;     
    const nuevoComentario = await crearComentario(ticket_id, usuario_id, contenido);
    await crearNotificacionesComentario(ticket_id, usuario_id); // 👈 Encapsulado en queries.js

    res.status(201).json(nuevoComentario);
  } catch (err) {
    console.error('Error al crear comentario:', err.message || err);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

module.exports = router;

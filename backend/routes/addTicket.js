const express = require('express');
const { insertTicket, editarTicket, eliminarTicket } = require('../db/queries');
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
router.put('/tickets/:id', async (req, res) => {
   try {
    const { id } = req.params;
    const result = await editarTicket(id, req.body); // ✅ no sobreescribe res
    res.json({ mensaje: 'Ticket actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar ticket:', error);
    res.status(500).json({ error: 'Error interno al actualizar el ticket' });
  }
});
router.delete('/ticketsEliminar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarTicket(id); // tu función de queries
    res.json({ mensaje: 'Ticket eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    res.status(500).json({ error: 'Error al eliminar el ticket' });
  }
});


module.exports = router;
const express = require('express');
const { obtenerUsuario, actualizarNotificaciones } = require('../db/queries');
const router = express.Router();


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await obtenerUsuario(id);
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'aqui?' });
  }
});

router.post('/actualizar-notificaciones', async (req, res) => {
  try {
    const { id, enProgreso, enRevision, terminado, comentariosNuevos } = req.body;

    await actualizarNotificaciones(id, {
      enProgreso,
      enRevision,
      terminado,
      comentariosNuevos
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar notificaciones:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar notificaciones.' });
  }
});

module.exports = router;

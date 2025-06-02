const express = require('express');
const router = express.Router();
const { getNotificacionesPorUsuario, eliminarNotificacion, marcarNotificacionLeida, marcarTodasNotificacionesLeidas, eliminarTodasNotificaciones } = require('../db/queries');

router.get('/:usuario_id', async (req, res) => {
  try {
    const notificaciones = await getNotificacionesPorUsuario(req.params.usuario_id);
    res.json(notificaciones);
  } catch (err) {
    console.error('Error al obtener notificaciones:', err);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});
router.put('/read/:id', async (req, res) => {
  try {
    const { is_read } = req.body;
    const result = await marcarNotificacionLeida(req.params.id, is_read);
    res.json(result);
  } catch (err) {
    console.error('Error al marcar como leída/desmarcar:', err);
    res.status(500).json({ error: 'Error al actualizar estado de la notificación' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const result = await eliminarNotificacion(req.params.id);
    res.json(result);
  } catch (err) {
    console.error('Error al eliminar notificación:', err);
    res.status(500).json({ error: 'Error al eliminar notificación' });
  }
});
// Marcar todas como leídas
router.put('/read-all/:usuario_id', async (req, res) => {
  try {
    await marcarTodasNotificacionesLeidas(req.params.usuario_id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error al marcar todas como leídas:', err);
    res.status(500).json({ error: 'Error al marcar todas como leídas' });
  }
});

// Eliminar todas las notificaciones
router.delete('/delete-all/:usuario_id', async (req, res) => {
  try {
    await eliminarTodasNotificaciones(req.params.usuario_id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error al eliminar todas las notificaciones:', err);
    res.status(500).json({ error: 'Error al eliminar todas las notificaciones' });
  }
});


module.exports = router;

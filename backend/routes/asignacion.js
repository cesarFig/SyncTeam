const express = require('express');
const router = express.Router();
const { asignacion, actualizarAsignacion, crearNotificacionAsignacion} = require('../db/queries');
router.post('/asignacion', async (req, res) => {
  try {
    const { ticket_id, usuario_id, fecha_asignacion, asignado_por } = req.body;
    const id = await asignacion({ ticket_id, usuario_id, fecha_asignacion, asignado_por });    
    await crearNotificacionAsignacion({ticket_id, usuario_id, asignado_por});       
    res.json({ message: 'Asignación creada correctamente', asignacion_id: id });
  } catch (error) {
    console.error('Error al insertar asignación:', error);
    res.status(500).json({ error: 'No se pudo crear la asignación' });
  }
});
router.put('/:ticket_id', async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { usuario_id, asignado_por } = req.body;
    const result = await actualizarAsignacion(ticket_id, usuario_id, asignado_por);
    await crearNotificacionAsignacion({ticket_id, usuario_id, asignado_por});    
    res.json({ mensaje: 'Asignación actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar asignación:', error);
    res.status(500).json({ error: 'Error interno al actualizar la asignación' });
  }
});

module.exports = router;

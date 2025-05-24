const express = require('express');
const router = express.Router();
const { asignacion} = require('../db/queries');
router.post('/asignacion', async (req, res) => {
  try {
    const { ticket_id, usuario_id, fecha_asignacion, asignado_por } = req.body;
    const id = await asignacion({ ticket_id, usuario_id, fecha_asignacion, asignado_por });
    res.json({ message: 'Asignación creada correctamente', asignacion_id: id });
  } catch (error) {
    console.error('Error al insertar asignación:', error);
    res.status(500).json({ error: 'No se pudo crear la asignación' });
  }
});

module.exports = router;

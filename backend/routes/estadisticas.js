const express = require('express');
const router = express.Router();
const { obtenerResumenDashboard } = require('../db/queries');

router.get('/resumen', async (req, res) => {
  try {
    const modo = req.query.modo || 'mensual';
    const data = await obtenerResumenDashboard(modo);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;

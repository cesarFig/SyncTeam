const express = require('express');
const router = express.Router();
const { eliminarArchivoPorId } = require('../db/queries'); // Asegúrate de importar correctamente
const fs = require('fs');
const path = require('path');

// Ruta DELETE: /api/archivo/:id
router.delete('/archivo/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // 🔁 obtener el archivo primero para saber su nombre y ruta
    const archivo = await eliminarArchivoPorId(id, true); // true = solo obtener, no eliminar todavía

    if (!archivo) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const rutaFisica = path.join(__dirname, '../uploads', archivo.url_archivo);
    if (fs.existsSync(rutaFisica)) {
      fs.unlinkSync(rutaFisica); // elimina del disco
    }

    // ahora sí elimina de la base de datos
    await eliminarArchivoPorId(id);

    res.status(200).json({ message: 'Archivo eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar archivo:', err);
    res.status(500).json({ error: 'Error al eliminar el archivo' });
  }
});

module.exports = router;

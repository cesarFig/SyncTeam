const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { registrarArchivo } = require('../db/queries'); // <-- Importa solo la función necesaria

// Asegura que la carpeta uploads exista
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .jpg, .png, etc.
    const baseName = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, '-')           // reemplaza espacios con guiones
      .replace(/[^a-z0-9\-]/g, '');   // elimina caracteres especiales
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14); // yyyymmddhhmmss
    const finalName = `${baseName}-${timestamp}${ext}`;
    cb(null, finalName);
  }
});

const upload = multer({ storage });

// Ruta de subida
router.post('/', upload.single('imagen'), async (req, res) => {
  if (!req.file) {
    console.log('No se recibió archivo');
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  console.log('Imagen guardada como:', req.file.filename);

  // Extra: intenta registrar en la tabla "archivo" si se reciben los datos
  const {
    ticket_id,
    pauta_id,
    tipo_archivo,
    is_attach,
    subido_por
  } = req.body;

  try {
    if (ticket_id && subido_por) {
      await registrarArchivo({
        ticket_id,
        pauta_id,
        nombre_archivo: req.file.originalname,
        url_archivo: req.file.filename,
        tipo_archivo: tipo_archivo || req.file.mimetype,
        tamano: req.file.size,
        is_attach,
        subido_por
      });
      console.log('Archivo registrado en la base de datos');
    }
  } catch (error) {
    console.error('Error al guardar archivo en DB:', error);
    // No detenemos la respuesta aunque falle el insert
  }

  res.status(200).json({ filename: req.file.filename });
});

module.exports = router;

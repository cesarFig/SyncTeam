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

  const {
    ticket_id,
    pauta_id, // pauta_id puede ser undefined si no se envía desde el frontend para este flujo
    tipo_archivo,
    is_attach, // Se espera 'true' o 'false' como string desde FormData
    subido_por
  } = req.body;

  // Convertir is_attach de string ('true'/'false') a booleano
  const isAttachBoolean = is_attach === 'true';

  try {
    // Asegurarse de que ticket_id y subido_por están presentes
    if (ticket_id && subido_por) {
      const newFile = await registrarArchivo({
        ticket_id: parseInt(ticket_id, 10), // Asegurar que ticket_id es un número
        pauta_id: pauta_id ? parseInt(pauta_id, 10) : null, // Manejar pauta_id opcional
        nombre_archivo: req.file.originalname,
        url_archivo: req.file.filename, // El nombre del archivo guardado en el servidor
        tipo_archivo: tipo_archivo || req.file.mimetype,
        tamano: req.file.size,
        is_attach: isAttachBoolean, // Usar el valor booleano
        subido_por: parseInt(subido_por, 10) // Asegurar que subido_por es un número
      });
      console.log('Archivo registrado en la base de datos:', newFile);
      // Devolver el objeto del archivo creado para que el frontend pueda actualizar la UI
      res.status(200).json({ filename: req.file.filename, newFile });
    } else {
      // Si faltan datos cruciales, no registrar en DB pero el archivo ya se subió.
      // Esto podría indicar un problema en el frontend.
      console.warn('Faltan ticket_id o subido_por. El archivo se subió pero no se registró en la BD.');
      res.status(200).json({ filename: req.file.filename, message: 'Archivo subido pero no registrado por falta de datos.' });
    }
  } catch (error) {
    console.error('Error al guardar archivo en DB:', error);
    // Aunque falle el insert en DB, el archivo se subió al servidor.
    // Se podría considerar eliminar el archivo del servidor si la transacción completa falla.
    res.status(500).json({ error: 'Error al registrar el archivo en la base de datos', details: error.message, filename: req.file.filename });
  }
});

module.exports = router;

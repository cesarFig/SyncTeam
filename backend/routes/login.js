const express = require('express');
const router = express.Router();
const { getUsuarioPorCorreo } = require('../db/queries'); // función para buscar el usuario
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { correo, password } = req.body;

  try {
    console.log('Correo recibido:', correo);
    console.log('contraseña:', password);
    const usuario = await getUsuarioPorCorreo(correo);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;

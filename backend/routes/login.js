const express = require('express');
const router = express.Router();
const { getUsuarioPorCorreo } = require('../db/queries'); // función para buscar el usuario
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { correo, password } = req.body;

    try {
      const usuario = await getUsuarioPorCorreo(correo);      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
  
      // ✅ Enviar el usuario en la respuesta
      res.status(200).json({ usuario });
  
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  
});

module.exports = router;

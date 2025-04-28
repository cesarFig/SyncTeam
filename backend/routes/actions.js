const express = require('express');
const { logAction } = require('../db/queries');

const router = express.Router();

router.post('/', async (req, res) => {
  const { action } = req.body;
  try {
    const loggedAction = await logAction(action);
    res.status(201).json(loggedAction);
  } catch (err) {
    res.status(500).send('Error logging action');
  }
});

module.exports = router;
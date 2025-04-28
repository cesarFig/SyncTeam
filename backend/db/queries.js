const pool = require('./connection');

// Example query to log an action
const logAction = async (action) => {
  try {
    const result = await pool.query(
      'INSERT INTO actions (action, timestamp) VALUES ($1, NOW()) RETURNING *',
      [action]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error logging action:', err);
    throw err;
  }
};

// Updated query to fetch all pautas with client name and remaining days
const getPautas = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_pauta AS id,
        p.titulo,
        p.propuesta AS descripcion,
        p.fecha_inicio,
        p.fecha_vencimiento,
        c.nombre AS cliente,
        DATE_PART('day', p.fecha_vencimiento::timestamp - NOW()::timestamp) AS dias_restantes
      FROM pauta p
      JOIN cliente c ON p.cliente = c.id_cliente
    `);
    return result.rows;
  } catch (err) {
    console.error('Error fetching pautas:', err);
    throw err;
  }
};

// Query to fetch tickets by pauta ID
const getTicketsByPauta = async (pautaId) => {
  try {
    const result = await pool.query('SELECT * FROM ticket WHERE pauta = $1', [pautaId]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching tickets for pauta:', err);
    throw err;
  }
};

module.exports = { logAction, getPautas, getTicketsByPauta };
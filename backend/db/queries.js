const pool = require('./connection');

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



const getPautas = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.titulo,
        p.descripcion,
        p.fecha_inicio,
        p.fecha_vencimiento,
        p.hora_inicial,
        p.hora_final,
        p.cliente,   
        p.imagen,
        p.cliente AS nombre_cliente,  -- Usamos directamente el campo cliente de la tabla pauta
        DATE_PART('day', p.fecha_vencimiento::timestamp - NOW()::timestamp) AS dias_restantes,
        COUNT(t.id) AS total_tickets,
        SUM(CASE WHEN t.estado = 4 THEN 1 ELSE 0 END) AS tickets_completados
      FROM pauta p
      LEFT JOIN ticket t ON p.id = t.pauta_id
      GROUP BY p.id
      ORDER BY p.fecha_vencimiento
    `);
    return result.rows;
  } catch (err) {
    console.error('Error fetching pautas:', err);
    throw err;
  }
};

const getTicketsByPauta = async (pautaId) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.id,
        t.titulo,
        t.descripcion,
        t.imagen,
        t.estado,
        t.fecha_creacion,
        t.fecha_vencimiento,
        t.hora_inicio,
        t.hora_final,
        c.nombre_categoria,
        c.color_rgb,
        pr.nombre AS prioridad,
        pr.nivel_prioridad,
        u.nombre AS asignado_nombre,
        u.apellidos AS asignado_apellidos,
        COUNT(co.id) AS total_comentarios
       FROM ticket t
       JOIN categoria c ON t.categoria_id = c.id
       JOIN prioridad pr ON t.prioridad_id = pr.id
       LEFT JOIN asignacion a ON t.id = a.ticket_id
       LEFT JOIN usuario u ON a.usuario_id = u.id
       LEFT JOIN comentario co ON t.id = co.ticket_id
       WHERE t.pauta_id = $1
       GROUP BY t.id, c.nombre_categoria, c.color_rgb, pr.nombre, pr.nivel_prioridad, u.nombre, u.apellidos
       ORDER BY pr.nivel_prioridad DESC, t.fecha_vencimiento`,
      [pautaId]
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching tickets for pauta:', err);
    throw err;
  }
};

const getColaboradores = async (pautaId) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT u.id, u.nombre, u.apellidos
        FROM usuario u
        JOIN asignacion a ON u.id = a.usuario_id
        JOIN ticket t ON a.ticket_id = t.id
        WHERE t.pauta_id = $1`,
      [pautaId]
    );
    console.error(result.rows)
    return result.rows;   
  } catch (err) {
    console.error('Error fetching colaboradores for pauta:', err);
    throw err;
  }
};


module.exports = { logAction, getPautas, getTicketsByPauta, getColaboradores };
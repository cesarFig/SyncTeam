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
    return result.rows;
  } catch (err) {
    console.error('Error fetching colaboradores for pauta:', err);
    throw err;
  }
};

const updateTicketEstado = async (ticketId, estado) => {
  try {
    const result = await pool.query(
      'UPDATE ticket SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, ticketId]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error updating ticket estado:', err);
    throw err;
  }
};
async function getUsuarioPorCorreo(correo) {
  const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [correo]);
  return result.rows[0];
}
const getRoles = async () => {
  const result = await pool.query('SELECT * FROM rol');
  return result.rows;
};

const insertUsuario = async ({ nombre, apellido, rol, correo, password }) => {
  const result = await pool.query(
    `INSERT INTO usuario (nombre, apellidos, rol_id, email, password)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [nombre, apellido, rol, correo, password]
  );
  return result.rows[0];
};
const insertPauta = async (data) => {
  const {
    cliente,
    titulo,
    descripcion,
    imagen,
    fecha_inicio,
    fecha_vencimiento,
    hora_inicial,
    hora_final,
    creado_por
  } = data;

  const result = await pool.query(
    `INSERT INTO pauta
      (cliente, titulo, descripcion, imagen, fecha_inicio, fecha_vencimiento, hora_inicial, hora_final, estado, creado_por)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, $9) RETURNING *`,
    [cliente, titulo, descripcion, imagen, fecha_inicio, fecha_vencimiento, hora_inicial, hora_final, creado_por]
  );

  return result.rows[0];
};
const getCategorias = async () => {
  const result = await pool.query('SELECT * FROM categoria');
  return result.rows;
};
const getPrioridades = async () => {
  const result = await pool.query('SELECT * FROM prioridad');
  return result.rows;
};

const insertTicket = async (data) => {
  const {
    titulo,
    descripcion,
    imagen,
    fecha_creacion,
    fecha_vencimiento,
    hora_inicio,
    hora_final,
    prioridad_id,
    categoria_id,
    pauta_id,
    creado_por
  } = data;

  const result = await pool.query(
    `INSERT INTO ticket (titulo, descripcion, imagen, estado, prioridad_id, categoria_id, pauta_id, fecha_vencimiento, hora_inicio, hora_final, creado_por, fecha_creacion) VALUES
    ($1, $2, $3, 1 ,$4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [titulo,
      descripcion,
      imagen,
      prioridad_id,
      categoria_id,
      pauta_id,
      fecha_vencimiento,
      hora_inicio,
      hora_final,
      creado_por,
      fecha_creacion]
  );

  return result.rows[0];
};
const getUsuarios = async () => {
  const result = await pool.query('SELECT * FROM usuario');
  return result.rows;
};
const getTicketsUser = async (id) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) AS "ticketsTotales",
      COUNT(CASE WHEN t.estado != 4 THEN 1 END) AS "ticketsActivos"
     FROM asignacion a
     JOIN ticket t ON a.ticket_id = t.id
     WHERE a.usuario_id = $1;`,
    [id]
  );
  return result.rows[0];
};
const getTickets = async (id) => {
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
      FROM asignacion a
      JOIN ticket t ON a.ticket_id = t.id
      JOIN categoria c ON t.categoria_id = c.id
      JOIN prioridad pr ON t.prioridad_id = pr.id
      LEFT JOIN usuario u ON a.usuario_id = u.id
      LEFT JOIN comentario co ON t.id = co.ticket_id
      WHERE a.usuario_id = $1
      GROUP BY t.id, c.nombre_categoria, c.color_rgb, pr.nombre, pr.nivel_prioridad, u.nombre, u.apellidos
      ORDER BY pr.nivel_prioridad DESC, t.fecha_vencimiento`,
      [id]
    );

    return result.rows;
  } catch (err) {
    console.error('Error fetching tickets for usuario:', err);
    throw err;
  }
};


module.exports = {
  logAction, getPautas, getTicketsByPauta, getColaboradores, updateTicketEstado, getUsuarioPorCorreo, getRoles,
  insertUsuario, insertPauta, getCategorias, getPrioridades, insertTicket, getUsuarios, getTicketsUser, getTickets
};
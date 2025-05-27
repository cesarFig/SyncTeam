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
    p.cliente AS nombre_cliente,
    DATE_PART('day', p.fecha_vencimiento::timestamp - NOW()::timestamp) AS dias_restantes,
    COUNT(t.id) AS total_tickets,
    SUM(CASE WHEN t.estado = 4 THEN 1 ELSE 0 END) AS tickets_completados,
    p.prioridad_id,
    pr.color_hex AS prioridad_color
    FROM pauta p
    LEFT JOIN ticket t ON p.id = t.pauta_id
    LEFT JOIN prioridad pr ON p.prioridad_id = pr.id
    GROUP BY p.id, p.prioridad_id, pr.color_hex
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
        t.pauta_id,
        t.categoria_id,
        t.prioridad_id,
        a.usuario_id,
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
       GROUP BY 
         t.id,
         t.pauta_id,
         t.categoria_id,
         t.prioridad_id,
         a.usuario_id,
         c.nombre_categoria,
         c.color_rgb,
         pr.nombre,
         pr.nivel_prioridad,
         u.nombre,
         u.apellidos
       ORDER BY pr.nivel_prioridad DESC, t.fecha_vencimiento`,
      [pautaId]
    );

    const tickets = result.rows;

    // 🔁 Para cada ticket, obtener sus archivos y agregarlos
    for (const ticket of tickets) {
      const archivosRes = await pool.query(
        `SELECT 
            id,
           nombre_archivo AS name,
           url_archivo AS url,
           tipo_archivo AS type
         FROM archivo
         WHERE ticket_id = $1`,
        [ticket.id]
      );

      ticket.attachments = archivosRes.rows; // 📎 Agrega los archivos al objeto ticket
    }

    return tickets;
  } catch (err) {
    console.error('Error fetching tickets for pauta:', err);
    throw err;
  }
};
const eliminarArchivoPorId = async (id, soloObtener = false) => {
  try {
    if (soloObtener) {
      const res = await pool.query(
        'SELECT nombre_archivo, url_archivo FROM archivo WHERE id = $1',
        [id]
      );
      return res.rows[0]; // para saber la URL física
    } else {
      await pool.query('DELETE FROM archivo WHERE id = $1', [id]);
    }
  } catch (error) {
    console.error('Error en eliminarArchivoPorId:', error);
    throw error;
  }
};
async function registrarArchivo({
  ticket_id,
  pauta_id,
  nombre_archivo,
  url_archivo,
  tipo_archivo,
  tamano,
  is_attach,
  subido_por
}) {
  const query = `
    INSERT INTO archivo (
      ticket_id, pauta_id, nombre_archivo, url_archivo, tipo_archivo,
      tamanio, fecha_creacion, is_attach, subido_por
    )
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)
  `;

  const values = [
  ticket_id,
  pauta_id && pauta_id !== '' ? pauta_id : null,
  nombre_archivo,
  url_archivo,
  tipo_archivo,
  tamano,
  is_attach === 'true',
  subido_por
  ];

  await pool.query(query, values);
}



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
async function getTicket(id) {
  const result = await pool.query('SELECT * FROM usuario WHERE id= $1', [id]);
  return result.rows[0];
}
async function getComentariosByTicketId(ticketId) {
  const result = await pool.query(`
    SELECT c.*, u.nombre, u.apellidos
    FROM comentario c
    JOIN usuario u ON u.id = c.usuario_id
    WHERE c.ticket_id = $1
    ORDER BY c.fecha_creacion ASC
  `, [ticketId]);
  return result.rows;
}

async function crearComentario(ticketId, usuarioId, contenido) {
  const result = await pool.query(`
    INSERT INTO comentario (ticket_id, usuario_id, contenido, fecha_creacion, editado)
    VALUES ($1, $2, $3, NOW(), FALSE)
    RETURNING *
  `, [ticketId, usuarioId, contenido]);
  return result.rows[0];
}
async function obtenerUsuario(id) {  
  console.log("entre");
  const result = await pool.query('SELECT * FROM usuario WHERE id= $1', [id]);
  return result.rows[0];
}
async function asignacion({ ticket_id, usuario_id, fecha_asignacion, asignado_por }) {
  const query = `
    INSERT INTO asignacion (ticket_id, usuario_id, fecha_asignacion, asignado_por)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;
  const result = await pool.query(query, [ticket_id, usuario_id, fecha_asignacion, asignado_por]);
  return result.rows[0].id;
}
const crearNotificacionesComentario = async (ticketId, usuarioId) => {
  const autor = await obtenerUsuario(usuarioId);

  if (autor.rol_id !== 1) {
    // Si es editor: notificar a admins
    const admins = await pool.query('SELECT id FROM usuario WHERE rol_id = 1');
    for (const admin of admins.rows) {
      await crearNotificacion({
        usuario_id: admin.id,
        tipo_notificacion: 'Nuevo comentario',
        mensaje: `Nuevo comentario en el ticket #${ticketId}`,
        emisor_id: usuarioId,
        ticket_id: ticketId
      });
    }
  } else {
    // Si es admin: notificar al asignado
    const asignado = await pool.query('SELECT usuario_id FROM asignacion WHERE ticket_id = $1 LIMIT 1', [ticketId]);
    const destino = asignado.rows[0]?.usuario_id;
    if (destino) {
      await crearNotificacion({
        usuario_id: destino,
        tipo_notificacion: 'Comentario',
        mensaje: `Nuevo comentario en tu ticket #${ticketId}`,
        emisor_id: usuarioId,
        ticket_id: ticketId
      });
    }
  }
};
const crearNotificacion = async ({ usuario_id, tipo_notificacion, mensaje, emisor_id, ticket_id }) => {
  try {
    const result = await pool.query(
      `INSERT INTO notificacion (
        usuario_id,
        tipo_notificacion,
        mensaje,
        is_read,
        fecha_creacion,
        emisor_id,
        ticket_id
      ) VALUES ($1, $2, $3, false, NOW(), $4, $5) RETURNING *`,
      [usuario_id, tipo_notificacion, mensaje, emisor_id, ticket_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error creando notificación:', err);
    throw err;
  }
};
const getNotificacionesPorUsuario = async (usuario_id) => {
  try {
    const result = await pool.query(`
      SELECT 
        n.id,
        n.usuario_id,
        n.tipo_notificacion,
        n.mensaje,
        n.is_read,
        n.fecha_creacion,
        u.nombre AS sender_nombre,
        u.apellidos AS sender_apellidos
      FROM notificacion n
      JOIN usuario u ON n.emisor_id = u.id
      WHERE n.usuario_id = $1
      ORDER BY n.fecha_creacion DESC
    `, [usuario_id]);

    return result.rows;
  } catch (err) {
    console.error('Error al obtener notificaciones:', err);
    throw err;
  }
};

const marcarNotificacionLeida = async (id) => {
  const result = await pool.query(`
    UPDATE notificacion
    SET is_read = true
    WHERE id = $1
    RETURNING *;
  `, [id]);
  return result.rows[0];
};
const eliminarNotificacion = async (id) => {
  const result = await pool.query(`
    DELETE FROM notificacion
    WHERE id = $1
    RETURNING *;
  `, [id]);
  return result.rows[0];
};
const eliminarTicket = async (ticketId) => {
    try {
    // Primero borra comentarios
    await pool.query('DELETE FROM comentario WHERE ticket_id = $1', [ticketId]);

    // Luego borra asignaciones si también tienes
    await pool.query('DELETE FROM asignacion WHERE ticket_id = $1', [ticketId]);

    // Finalmente borra el ticket
    await pool.query('DELETE FROM ticket WHERE id = $1', [ticketId]);
  } catch (err) {
    console.error('Error al eliminar ticket:', err);
    throw err;
  }
};


async function editarTicket(id, data) {
  const {
    titulo,
    descripcion,
    imagen,
    fecha_vencimiento,
    hora_inicio,
    hora_final,
    prioridad_id,
    categoria_id,
    pauta_id
  } = data;

  const query = `
    UPDATE ticket SET
      titulo = $1,
      descripcion = $2,
      imagen = $3,
      fecha_vencimiento = $4,
      hora_inicio = $5,
      hora_final = $6,
      prioridad_id = $7,
      categoria_id = $8,
      pauta_id = $9
    WHERE id = $10
  `;

  const values = [
    titulo,
    descripcion,
    imagen,
    fecha_vencimiento,
    hora_inicio,
    hora_final,
    prioridad_id,
    categoria_id,
    pauta_id,
    id
  ];

  await pool.query(query, values);
}

// Crear o actualizar asignación
async function actualizarAsignacion(ticket_id, usuario_id, asignado_por) {
  const existe = await pool.query('SELECT * FROM asignacion WHERE ticket_id = $1', [ticket_id]);

  if (existe.rowCount > 0) {
    const updateQuery = `
      UPDATE asignacion
      SET usuario_id = $1,
          fecha_asignacion = NOW(),
          asignado_por = $2
      WHERE ticket_id = $3
    `;
    await pool.query(updateQuery, [usuario_id, asignado_por, ticket_id]);
  } else {
    const insertQuery = `
      INSERT INTO asignaciones (ticket_id, usuario_id, fecha_asignacion, asignado_por)
      VALUES ($1, $2, NOW(), $3)
    `;
    await pool.query(insertQuery, [ticket_id, usuario_id, asignado_por]);
  }
}



module.exports = {
  logAction, getPautas, getTicketsByPauta, getColaboradores, updateTicketEstado, getUsuarioPorCorreo, getRoles,
  insertUsuario, insertPauta, getCategorias, getPrioridades, insertTicket, getUsuarios, getTicketsUser, getTickets, getTicket, getComentariosByTicketId, crearComentario
  ,obtenerUsuario, asignacion,  crearNotificacionesComentario, getNotificacionesPorUsuario , marcarNotificacionLeida, eliminarNotificacion,
  editarTicket, actualizarAsignacion, eliminarTicket, registrarArchivo, eliminarArchivoPorId
};
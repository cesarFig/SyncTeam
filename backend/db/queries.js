const pool = require('./connection');
const moment = require('moment-timezone');


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
      `SELECT DISTINCT u.id, u.nombre, u.apellidos, u.avatar
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
/** Update an existing pauta */
const updatePauta = async (id, data) => {
  const {
    cliente,
    titulo,
    descripcion,
    imagen,
    fecha_vencimiento,
    hora_inicial,
    hora_final
  } = data;
  const result = await pool.query(
    `UPDATE pauta SET
      cliente = $1,
      titulo = $2,
      descripcion = $3,
      imagen = $4,
      fecha_vencimiento = $5,
      hora_inicial = $6,
      hora_final = $7
     WHERE id = $8 RETURNING *`,
    [cliente, titulo, descripcion, imagen, fecha_vencimiento, hora_inicial, hora_final, id]
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

async function getTicketById(id) {
  // const result = await pool.query('SELECT * FROM usuario WHERE id= $1', [id]); // Old query for user
  // return result.rows[0];
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
        c.nombre_categoria,
        c.color_rgb,
        pr.nombre AS prioridad,
        pr.nivel_prioridad,
        u.nombre AS asignado_nombre,
        u.apellidos AS asignado_apellidos,
        asg.usuario_id -- to get the assigned user's ID for currentUser later if needed
      FROM ticket t
      LEFT JOIN categoria c ON t.categoria_id = c.id
      LEFT JOIN prioridad pr ON t.prioridad_id = pr.id
      LEFT JOIN asignacion asg ON t.id = asg.ticket_id
      LEFT JOIN usuario u ON asg.usuario_id = u.id
      WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null; // Ticket not found
    }

    const ticket = result.rows[0];

    // Fetch attachments for the ticket
    const archivosRes = await pool.query(
      `SELECT 
          id,
         nombre_archivo AS name,
         url_archivo AS url,
         tipo_archivo AS type,
         is_attach
       FROM archivo
       WHERE ticket_id = $1`,
      [ticket.id]
    );
    ticket.attachments = archivosRes.rows;

    // Fetch comments for the ticket (optional, if TicketFull needs them directly)
    // const comentariosRes = await getComentariosByTicketId(ticket.id);
    // ticket.activityLog = comentariosRes; // Or map to a different structure

    return ticket;
  } catch (err) {
    console.error('Error fetching single ticket by ID:', err);
    throw err;
  }
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
  const result = await pool.query(`
    SELECT 
      u.id,
      u.nombre,
      u.apellidos,
      u.email,
      u.avatar,
      u.password,
      u.fecha_creacion,
      r.nombre AS rol,
      u.noti_en_progreso,
      u.noti_en_revision,
      u.noti_terminado,
      u.noti_comentarios
    FROM usuario u
    LEFT JOIN rol r ON u.rol_id = r.id
    WHERE u.id = $1
  `, [id]);

  return result.rows[0];
}
async function actualizarNotificaciones(usuarioId, notificaciones) {
  const { enProgreso, enRevision, terminado, comentariosNuevos } = notificaciones;

  await pool.query(`
    UPDATE usuario SET
      noti_en_progreso = $1,
      noti_en_revision = $2,
      noti_terminado = $3,
      noti_comentarios = $4
    WHERE id = $5
  `, [enProgreso, enRevision, terminado, comentariosNuevos, usuarioId]);
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

  if (autor.rol !== "Administrador") {
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
const crearNotificacionesEstado = async (ticketId, usuario, estado) => {
  const autor = await obtenerUsuario(usuario);
  let estadoNombre;
  switch (estado) {
    case 1:
      estadoNombre = "Por hacer"
      break;
    case 2:
      estadoNombre = "En progreso"
      break;
    case 3:
      estadoNombre = "Revision"
      break;
    case 4:
      estadoNombre = "Terminado"
      break;
  }

  if (autor.rol !== "Administrador") {
    // Si es editor: notificar a admins
    const admins = await pool.query('SELECT id FROM usuario WHERE rol_id = 1');
    for (const admin of admins.rows) {
      await crearNotificacion({
        usuario_id: admin.id,
        tipo_notificacion: 'Cambio de estado de ticket',
        mensaje: `Ha cambiado el estado del ticket #${ticketId} a la seccion: ${estadoNombre}`,
        emisor_id: usuario,
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
        tipo_notificacion: 'Cambio del estado del ticket',
        mensaje: `El estado de tu ticket #${ticketId} ha cambiado a: ${estadoNombre}`,
        emisor_id: usuario,
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
const crearNotificacionAsignacion = async ({ ticket_id, usuario_id, asignado_por }) => {  
  await crearNotificacion({
    usuario_id: usuario_id,
    tipo_notificacion: 'Asignacion a un ticket',
    mensaje: `Te ha asignado al ticket #${ticket_id}`,
    emisor_id: asignado_por,
    ticket_id: ticket_id
  });
};
// db/queries.js

const obtenerResumenDashboard = async (modo = 'mensual') => {
  const totalTickets = await pool.query(`SELECT COUNT(*) FROM ticket`);
  const porEstado = await pool.query(`SELECT estado, COUNT(*) FROM ticket GROUP BY estado`);
  const promedioHoras = await pool.query(`
    SELECT ROUND(AVG(EXTRACT(EPOCH FROM (fecha_vencimiento - fecha_creacion)) / 3600)) as horas
    FROM ticket WHERE estado = '4'
  `);

  let ticketsPorPeriodo = [];
  let porcentajeSemana = 0;
  let rangoFechas = '';
  let completadosSemanaAnterior = 0;

  if (modo === 'mensual') {
    const resultado = await pool.query(`
      SELECT TO_CHAR(fecha_vencimiento, 'Mon') AS etiqueta, COUNT(*) 
      FROM ticket 
      WHERE estado = '4'
      GROUP BY etiqueta, EXTRACT(MONTH FROM fecha_vencimiento)
      ORDER BY EXTRACT(MONTH FROM fecha_vencimiento)
    `);

    const meses = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    ticketsPorPeriodo = meses.map(mes => {
      const encontrado = resultado.rows.find(r => r.etiqueta.trim() === mes);
      return { etiqueta: mes, count: encontrado ? encontrado.count : 0 };
    });

  } else if (modo === 'semanal') {
    const inicioSemana = moment.tz('America/Mexico_City').startOf('isoWeek').startOf('day');
    const finSemana = moment.tz('America/Mexico_City').endOf('isoWeek').endOf('day');

    const resultado = await pool.query(`
      SELECT TO_CHAR(fecha_vencimiento, 'Dy') AS etiqueta, COUNT(*)
      FROM ticket 
      WHERE estado = '4'
      AND fecha_vencimiento BETWEEN $1 AND $2
      GROUP BY etiqueta
    `, [inicioSemana.toDate(), finSemana.toDate()]);

    const dias = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    ticketsPorPeriodo = dias.map(dia => {
      const encontrado = resultado.rows.find(r => r.etiqueta.trim() === dia);
      return { etiqueta: dia, count: encontrado ? encontrado.count : 0 };
    });

    const totalSemana = await pool.query(`
      SELECT COUNT(*) FROM ticket 
      WHERE fecha_vencimiento BETWEEN $1 AND $2
    `, [inicioSemana.toDate(), finSemana.toDate()]);

    const completadosSemana = await pool.query(`
      SELECT COUNT(*) FROM ticket 
      WHERE estado = '4' AND fecha_vencimiento BETWEEN $1 AND $2
    `, [inicioSemana.toDate(), finSemana.toDate()]);

    porcentajeSemana = totalSemana.rows[0].count > 0
      ? Math.round((completadosSemana.rows[0].count / totalSemana.rows[0].count) * 100)
      : 0;

    rangoFechas = `Del ${inicioSemana.format('D [de] MMMM')} al ${finSemana.format('D [de] MMMM')}`;

    const inicioAnterior = moment(inicioSemana).subtract(1, 'week');
    const finAnterior = moment(finSemana).subtract(1, 'week');
    const completadosPrevios = await pool.query(`
      SELECT COUNT(*) FROM ticket
      WHERE estado = '4' AND fecha_vencimiento BETWEEN $1 AND $2
    `, [inicioAnterior.toDate(), finAnterior.toDate()]);

    completadosSemanaAnterior = parseInt(completadosPrevios.rows[0].count);
  }

  // 👇 Nueva lógica para pautas completadas basadas en tickets
  const pautasActuales = await pool.query(`
    SELECT COUNT(*) FROM (
  SELECT pauta_id
  FROM ticket
  WHERE pauta_id IS NOT NULL
  GROUP BY pauta_id
  HAVING COUNT(*) = COUNT(CASE WHEN estado = 4 THEN 1 END)
    AND MIN(EXTRACT(MONTH FROM fecha_creacion)) = EXTRACT(MONTH FROM CURRENT_DATE)
) AS pautas_completadas;
  `);

  const pautasAnteriores = await pool.query(`
   SELECT COUNT(*) FROM (
  SELECT pauta_id
  FROM ticket
  WHERE pauta_id IS NOT NULL
  GROUP BY pauta_id
  HAVING COUNT(*) = COUNT(CASE WHEN estado = 4 THEN 1 END)
    AND MIN(EXTRACT(MONTH FROM fecha_creacion)) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
) AS pautas_previas;
  `);

  return {
    totalTickets: parseInt(totalTickets.rows[0].count),
    ticketsPorEstado: porEstado.rows,
    ticketsPorPeriodo,
    tiempoPromedio: promedioHoras.rows[0].horas ? parseInt(promedioHoras.rows[0].horas) : 0,
    porcentajeSemana,
    rangoFechas,
    completadosSemanaAnterior,
    pautas: parseInt(pautasActuales.rows[0].count),
    pautasPrevias: parseInt(pautasAnteriores.rows[0].count)
  };
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
        u.apellidos AS sender_apellidos,
        u.avatar AS emisor_avatar  -- 👈 avatar del emisor
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


const marcarNotificacionLeida = async (id, is_read) => {
  const result = await pool.query(`
    UPDATE notificacion
    SET is_read = $1
    WHERE id = $2
    RETURNING *;
  `, [is_read, id]);
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
// Marcar todas las notificaciones como leídas para un usuario
async function marcarTodasNotificacionesLeidas(usuarioId) {
  try {
    await pool.query('UPDATE notificacion SET is_read = true WHERE usuario_id = $1', [usuarioId]);
    return { success: true };
  } catch (err) {
    console.error('Error al marcar todas como leídas:', err);
    throw err;
  }
}

// Eliminar todas las notificaciones de un usuario
async function eliminarTodasNotificaciones(usuarioId) {
  try {
    await pool.query('DELETE FROM notificacion WHERE usuario_id = $1', [usuarioId]);
    return { success: true };
  } catch (err) {
    console.error('Error al eliminar todas las notificaciones:', err);
    throw err;
  }
}
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
async function actualizarAvatarUsuario(id, avatar) {
  const query = 'UPDATE usuario SET avatar = $1 WHERE id = $2';
  const values = [avatar, id];
  await pool.query(query, values);
}
async function eliminarAvatarUsuario(id) {
  const query = 'UPDATE usuario SET avatar = NULL WHERE id = $1';
  await pool.query(query, [id]);
}


async function obtenerProximoTicketDashboardPorUsuario(userId) {
  try {
    const ticketQuery = `
      SELECT
          t.id AS "ticketId",
          t.titulo AS "tituloTicket",
          t.imagen AS "imagenPrincipal",
          t.estado AS "estadoId",
          t.fecha_vencimiento AS "fechaVencimiento",
          t.hora_final AS "horaFinal",
          t.descripcion AS "descripcion",
          p.titulo AS "pautaNombre",
          r.nombre AS "rolAsignado"
      FROM asignacion a
      JOIN ticket t ON a.ticket_id = t.id
      JOIN pauta p ON t.pauta_id = p.id
      JOIN usuario u ON a.usuario_id = u.id
      JOIN rol r ON u.rol_id = r.id
      WHERE a.usuario_id = $1
        AND t.estado != 4 -- Not 'Terminado'
      ORDER BY t.fecha_vencimiento ASC, t.hora_final ASC
      LIMIT 1;
    `;
    const ticketResult = await pool.query(ticketQuery, [userId]);

    if (ticketResult.rows.length === 0) {
      return null;
    }

    const ticket = ticketResult.rows[0];


    let progreso = 0;
    if (ticket.estadoId === 1) { // Por hacer
      progreso = 0;
    } else if (ticket.estadoId === 2) { // En progreso
      progreso = 25;
    } else if (ticket.estadoId === 3) { // En revisión
      progreso = 75;
    } // No 'Terminado' (estado 4) due to WHERE clause

    // 4. Calculate remaining hours until fecha_vencimiento
    let horasRestantes = 0;
    if (ticket.fechaVencimiento) {
      const [year, month, day] = ticket.fechaVencimiento.toISOString().split('T')[0].split('-').map(Number);
      const [hours, minutes, seconds] = ticket.horaFinal ? ticket.horaFinal.split(':').map(Number) : [0, 0, 0];
      const dueDate = new Date(year, month - 1, day, hours, minutes, seconds || 0);
      const currentTime = new Date();
      const diffMillis = dueDate.getTime() - currentTime.getTime();
      horasRestantes = Math.max(0, Math.round(diffMillis / (1000 * 60 * 60)));
    }
    
    // 5. Format the data
    return {
      ticketId: ticket.ticketId,
      tituloTicket: ticket.tituloTicket,
      imagenPrincipal: ticket.imagenPrincipal, // Frontend handles default if null
      pautaNombre: ticket.pautaNombre,
      progreso: progreso,
      horasRestantes: horasRestantes,
      rolAsignado: ticket.rolAsignado,
      descripcion: ticket.descripcion
    };

  } catch (err) {
    console.error('Error fetching proximo ticket dashboard por usuario:', err);
    throw err;
  }
}

async function obtenerEstadisticasTicketsCreativo(creativoId) {
  try {
    let totalQuery = `
      SELECT COUNT(t.id) AS count
      FROM ticket t
      JOIN asignacion a ON t.id = a.ticket_id
    `;
    let estadosQuery = `
      SELECT
          SUM(CASE WHEN t.estado = 1 THEN 1 ELSE 0 END) AS pendientes,
          SUM(CASE WHEN t.estado = 2 THEN 1 ELSE 0 END) AS enProgreso,
          SUM(CASE WHEN t.estado = 3 THEN 1 ELSE 0 END) AS pendientesRevision,
          SUM(CASE WHEN t.estado = 4 THEN 1 ELSE 0 END) AS completados
      FROM ticket t
      JOIN asignacion a ON t.id = a.ticket_id
    `;

    const params = [];
    if (creativoId !== 'todos') {
      totalQuery += ' WHERE a.usuario_id = $1';
      estadosQuery += ' WHERE a.usuario_id = $1';
      params.push(creativoId);
    }

    const totalResult = await pool.query(totalQuery, params);
    const ticketsTotales = parseInt(totalResult.rows[0]?.count || 0);

    const estadosResult = await pool.query(estadosQuery, params);
    
    const stats = estadosResult.rows[0] || {};

    return {
      ticketsTotales,
      pendientes: parseInt(stats.pendientes || 0),
      enProgreso: parseInt(stats.enprogreso || 0),
      pendientesRevision: parseInt(stats.pendientesrevision || 0),
      completados: parseInt(stats.completados || 0),
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de tickets:', error); // Generic error message
    throw error;
  }
}

// Función para obtener todos los tickets
async function getAllTickets() {
  const result = await pool.query('SELECT * FROM ticket');
  return result.rows;
}

module.exports = {
  logAction, getPautas, getTicketsByPauta, getColaboradores, updateTicketEstado, getUsuarioPorCorreo, getRoles,
  insertUsuario, insertPauta, updatePauta, getCategorias, getPrioridades, insertTicket, getUsuarios, getTicketsUser, getTickets, getTicket, getComentariosByTicketId, crearComentario
  , obtenerUsuario, asignacion, crearNotificacionesComentario, getNotificacionesPorUsuario, marcarNotificacionLeida, eliminarNotificacion,
  editarTicket, actualizarAsignacion, eliminarTicket, registrarArchivo, eliminarArchivoPorId, crearNotificacionesEstado, actualizarAvatarUsuario, eliminarAvatarUsuario,
  actualizarNotificaciones, obtenerProximoTicketDashboardPorUsuario, crearNotificacionAsignacion, getTicketById,obtenerResumenDashboard, obtenerEstadisticasTicketsCreativo,
  getAllTickets,
  marcarTodasNotificacionesLeidas,
  eliminarTodasNotificaciones,
};
const db = require('../config/db');

// Público/usuario: obtener slots disponibles (filtrando fechas bloqueadas)
exports.getAvailable = async (req, res) => {
  try {
    const [slots] = await db.query(
      `SELECT sl.*
       FROM availability_slots sl
       WHERE sl.is_available = 1
         AND sl.slot_date >= CURDATE()
         AND sl.slot_date NOT IN (SELECT blocked_date FROM blocked_dates)
       ORDER BY sl.slot_date, sl.slot_time`
    );
    return res.json(slots);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Admin: crear slot
exports.createSlot = async (req, res) => {
  try {
    const { slot_date, slot_time } = req.body;
    await db.query('INSERT INTO availability_slots (slot_date, slot_time) VALUES (?,?)', [slot_date, slot_time]);
    return res.status(201).json({ message: 'Slot creado' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'El slot ya existe' });
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Admin: eliminar slot
exports.deleteSlot = async (req, res) => {
  try {
    await db.query('DELETE FROM availability_slots WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Slot eliminado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Admin: listar todos los slots
exports.listSlots = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM availability_slots ORDER BY slot_date, slot_time');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Admin: bloquear fecha
exports.blockDate = async (req, res) => {
  try {
    const { blocked_date, reason } = req.body;
    await db.query('INSERT INTO blocked_dates (blocked_date, reason) VALUES (?,?)', [blocked_date, reason || null]);
    return res.status(201).json({ message: 'Fecha bloqueada' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Fecha ya bloqueada' });
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Admin: desbloquear fecha
exports.unblockDate = async (req, res) => {
  try {
    await db.query('DELETE FROM blocked_dates WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Fecha desbloqueada' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Admin: listar fechas bloqueadas
exports.listBlocked = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blocked_dates ORDER BY blocked_date');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

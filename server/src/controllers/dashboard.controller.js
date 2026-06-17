const db = require('../config/db');

exports.metrics = async (req, res) => {
  try {
    const [[{ total_users }]] = await db.query(
      "SELECT COUNT(*) AS total_users FROM users WHERE role='user'"
    );
    const [[{ users_with_quotes }]] = await db.query(
      "SELECT COUNT(DISTINCT user_id) AS users_with_quotes FROM quotes"
    );
    const [[{ users_with_appointments }]] = await db.query(
      "SELECT COUNT(DISTINCT user_id) AS users_with_appointments FROM appointments"
    );
    const [[{ pending_quotes }]] = await db.query(
      "SELECT COUNT(*) AS pending_quotes FROM quotes WHERE status='pending'"
    );
    const [[{ today_appointments }]] = await db.query(
      `SELECT COUNT(*) AS today_appointments FROM appointments a
       JOIN availability_slots sl ON sl.id = a.slot_id
       WHERE sl.slot_date = CURDATE()`
    );
    const [[{ unread_messages }]] = await db.query(
      "SELECT COUNT(*) AS unread_messages FROM contact_messages WHERE is_read = 0"
    );

    return res.json({
      total_users,
      users_with_quotes,
      users_with_appointments,
      conversion_rate: total_users > 0
        ? ((users_with_appointments / total_users) * 100).toFixed(1)
        : '0.0',
      pending_quotes,
      today_appointments,
      unread_messages,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

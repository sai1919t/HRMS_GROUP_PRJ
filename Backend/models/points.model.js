import pool from '../db/db.js';

export const createPointsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS points_transactions (
      id SERIAL PRIMARY KEY,
      admin_id INTEGER REFERENCES users(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      amount INTEGER NOT NULL,
      reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('✅ Points transactions table created/updated successfully');
  } catch (err) {
    console.error('❌ Error creating points transactions table', err);
  }
};

export const addPoints = async (adminId, userId, amount, reason='') => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const update = `UPDATE users SET points = points + $1 WHERE id = $2 RETURNING *`;
    const { rows } = await client.query(update, [amount, userId]);
    await client.query(`INSERT INTO points_transactions (admin_id, user_id, amount, reason) VALUES ($1,$2,$3,$4)`, [adminId, userId, amount, reason]);
    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const redeemPoints = async (userId, amount, reason='') => {
  // Deduct points from a user if they have enough balance. Amount should be positive (points to deduct).
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check current balance
    const { rows: currentRows } = await client.query('SELECT points FROM users WHERE id = $1 FOR UPDATE', [userId]);
    if (!currentRows || currentRows.length === 0) throw new Error('User not found');
    const current = currentRows[0].points || 0;
    if (current < amount) {
      throw new Error('Insufficient points');
    }

    // Deduct
    const { rows } = await client.query('UPDATE users SET points = points - $1 WHERE id = $2 RETURNING *', [amount, userId]);

    // Record negative transaction (admin_id set to user for redemption)
    await client.query(`INSERT INTO points_transactions (admin_id, user_id, amount, reason) VALUES ($1,$2,$3,$4)`, [userId, userId, -Math.abs(amount), reason]);

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const getRecentPointTransactions = async (userId) => {
  const { rows } = await pool.query(`SELECT pt.*, a.fullname as admin_name FROM points_transactions pt LEFT JOIN users a ON pt.admin_id = a.id WHERE pt.user_id = $1 ORDER BY pt.created_at DESC LIMIT 50`, [userId]);
  return rows;
};

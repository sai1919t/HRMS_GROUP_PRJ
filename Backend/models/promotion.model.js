import pool from '../db/db.js';

export const createPromotionsTable = async () => {
  const qry = `
    CREATE TABLE IF NOT EXISTS promotions (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER NOT NULL REFERENCES users(id),
      created_by INTEGER NOT NULL REFERENCES users(id),
      new_role VARCHAR(255),
      new_salary VARCHAR(255),
      reason TEXT,
      status VARCHAR(50) DEFAULT 'published',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const appsQry = `
    CREATE TABLE IF NOT EXISTS promotion_applications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      promotion_id INTEGER NOT NULL REFERENCES promotions(id),
      cover_letter TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(qry);
    await pool.query(appsQry);
    console.log('✅ Promotions tables created/updated successfully');
  } catch (err) {
    console.error('❌ Error creating promotions tables', err);
  }
};

export const createPromotion = async (employeeId, createdBy, newRole, newSalary, reason) => {
  const { rows } = await pool.query(
    'INSERT INTO promotions (employee_id, created_by, new_role, new_salary, reason) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [employeeId, createdBy, newRole, newSalary, reason]
  );
  return rows[0];
};

export const getPromotions = async () => {
  const { rows } = await pool.query('SELECT p.*, u.fullname as employee_name, u.email as employee_email FROM promotions p JOIN users u ON p.employee_id = u.id ORDER BY p.created_at DESC');
  return rows;
};

export const getPromotionById = async (id) => {
  const { rows } = await pool.query('SELECT p.*, u.fullname as employee_name, u.email as employee_email FROM promotions p JOIN users u ON p.employee_id = u.id WHERE p.id = $1', [id]);
  return rows[0];
};

export const createPromotionApplication = async (userId, promotionId, coverLetter) => {
  const { rows } = await pool.query('INSERT INTO promotion_applications (user_id, promotion_id, cover_letter) VALUES ($1,$2,$3) RETURNING *', [userId, promotionId, coverLetter]);
  return rows[0];
};

export const getApplicationsByPromotion = async (promotionId) => {
  const { rows } = await pool.query('SELECT a.*, u.fullname as applicant_name, u.email as applicant_email FROM promotion_applications a JOIN users u ON a.user_id = u.id WHERE a.promotion_id = $1 ORDER BY a.created_at DESC', [promotionId]);
  return rows;
};

export const getUserApplications = async (userId) => {
  const { rows } = await pool.query('SELECT a.*, p.new_role, p.new_salary, p.reason, p.employee_id FROM promotion_applications a JOIN promotions p ON a.promotion_id = p.id WHERE a.user_id = $1 ORDER BY a.created_at DESC', [userId]);
  return rows;
};
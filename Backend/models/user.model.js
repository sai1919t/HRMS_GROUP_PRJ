import pool from "../db/db.js"; // db

// ... existing code ...
export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullname VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      designation VARCHAR(100) DEFAULT '',
      profile_picture TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    // Ensure columns exist for older databases
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(100) DEFAULT ''`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT`);
    console.log("✅ Users table created/updated successfully");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
  }
};

export const createUser = async (fullname, email, password, designation = '') => {
  const query = `
    INSERT INTO users (fullname, email, password, designation)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [fullname, email, password, designation];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updateUserProfile = async (id, fullname, email, designation, profile_picture) => {
  let query = `
        UPDATE users 
        SET fullname = $1, email = $2, designation = $3
        WHERE id = $4
        RETURNING *;
    `;
  let values = [fullname, email, designation, id];

  if (profile_picture) {
    query = `
            UPDATE users 
            SET fullname = $1, email = $2, designation = $3, profile_picture = $4
            WHERE id = $5
            RETURNING *;
        `;
    values = [fullname, email, designation, profile_picture, id];
  }

  const { rows } = await pool.query(query, values);
  return rows[0];
}

export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const updateUser = async (id, updates) => {
  // Only allow these fields to be updated
  const allowed = ["fullname", "email", "password", "designation"];
  const setClauses = [];
  const values = [];
  let idx = 1;
  for (const key of Object.keys(updates)) {
    if (!allowed.includes(key)) continue;
    setClauses.push(`${key} = $${idx}`);
    values.push(updates[key]);
    idx++;
  }

  if (setClauses.length === 0) {
    const user = await findUserById(id);
    return user;
  }

  const query = `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING id, fullname, email, designation, created_at`;
  values.push(id);
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllUsers = async () => {
  const query = "SELECT id, fullname, email, designation, profile_picture FROM users ORDER BY fullname";
  const { rows } = await pool.query(query);
  return rows;
};

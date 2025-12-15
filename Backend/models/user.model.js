import pool from "../db/db.js"; // db

export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullname VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      designation VARCHAR(100) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    // Ensure designation column exists for older databases
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(100) DEFAULT ''`);
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

export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const getAllUsers = async () => {
  const query = "SELECT id, fullname, email, designation FROM users ORDER BY fullname";
  const { rows } = await pool.query(query);
  return rows;
};

import pool from "../db/db.js";

// Create jobs table
export const createJobsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      experience VARCHAR(100) NOT NULL,
      salary VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`);
    console.log("✅ Jobs table created successfully");
  } catch (error) {
    console.error("❌ Error creating jobs table:", error);
  }
};

// Create a new job
export const createJob = (data) => {
  const { title, location, experience, salary } = data;
  return pool.query(
    "INSERT INTO jobs (title, location, experience, salary) VALUES ($1,$2,$3,$4) RETURNING *",
    [title, location, experience, salary]
  );
};

// Get all jobs
export const getJobs = () => {
  return pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
};

// Delete job
export const deleteJobById = (id) => {
  return pool.query(
    "DELETE FROM jobs WHERE id = $1 RETURNING *",
    [id]
  );
};

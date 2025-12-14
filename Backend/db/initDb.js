import pool from "../db/db.js";

// Initialize the database by creating necessary tables for the ATS system
export const initDb = async () => {
  try {
    // Create Jobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100),
        location VARCHAR(100),
        experience VARCHAR(50),
        salary VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
     // Create Applications table 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
        name VARCHAR(100),
        email VARCHAR(100),
        resume TEXT,
        status VARCHAR(20) DEFAULT 'APPLIED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
     // Create Interviews table 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS interviews (
        id SERIAL PRIMARY KEY,
        application_id INT REFERENCES applications(id),
        interview_date DATE,
        interview_time TIME,
        interviewer VARCHAR(100),
        mode VARCHAR(20)
      );
    `);
     // Create Offer Letters table 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS offer_letters (
        id SERIAL PRIMARY KEY,
        application_id INT REFERENCES applications(id),
        position VARCHAR(100),
        ctc VARCHAR(50),
        joining_date DATE,
        status VARCHAR(20) DEFAULT 'PENDING'
      );
    `);

    console.log("✅ ATS tables created / already exist");
  } catch (error) {
    console.error("❌ DB Init Error:", error.message);
  }
};


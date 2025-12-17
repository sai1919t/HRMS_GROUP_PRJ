import pool from "../db/db.js";

export const createMeetingTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS meetings (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      meeting_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const createMeeting = async (meeting) => {
  const { title, meeting_date, start_time, end_time, created_by } = meeting;

  const result = await pool.query(
    `INSERT INTO meetings (title, meeting_date, start_time, end_time, created_by)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, meeting_date, start_time, end_time, created_by]
  );

  return result.rows[0];
};

export const getMeetings = async () => {
  const result = await pool.query(
    "SELECT * FROM meetings ORDER BY meeting_date ASC"
  );
  return result.rows;
};

// ✅ NEW: Update an existing meeting
export const updateMeeting = async (id, meeting) => {
  const { title, meeting_date, start_time, end_time } = meeting;
  
  const result = await pool.query(
    `UPDATE meetings 
     SET title = $1, meeting_date = $2, start_time = $3, end_time = $4
     WHERE id = $5
     RETURNING *`,
    [title, meeting_date, start_time, end_time, id]
  );

  return result.rows[0];
};

// ✅ NEW: Delete a meeting
export const deleteMeeting = async (id) => {
  const result = await pool.query(
    `DELETE FROM meetings WHERE id = $1 RETURNING id`,
    [id]
  );
  
  return result.rows[0];
};
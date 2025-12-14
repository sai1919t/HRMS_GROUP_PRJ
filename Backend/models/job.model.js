import pool from "../db/db.js";

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

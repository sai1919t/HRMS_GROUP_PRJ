import pool from "../db/db.js";

// Apply for a job
export const applyJob = async (req, res) => {
  const { name, email, resume } = req.body;
  const job_id = req.params.id;

  const result = await pool.query(
    "INSERT INTO applications (job_id, name, email, resume) VALUES ($1,$2,$3,$4) RETURNING *",
    [job_id, name, email, resume]
  );

  res.status(201).json(result.rows[0]);
};
// Get all applications
export const getApplications = async (req, res) => {
  const result = await pool.query("SELECT * FROM applications");
  res.json(result.rows);
};
// Update application status
export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  await pool.query(
    "UPDATE applications SET status=$1 WHERE id=$2",
    [status, id]
  );

  res.json({ message: "Status updated" });
};

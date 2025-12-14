import pool from "../db/db.js";

// Application Model
export const applyJob = (job_id, data) => {
  return pool.query(
    `INSERT INTO applications 
     (job_id, name, email, resume, status)
     VALUES ($1,$2,$3,$4,'APPLIED') RETURNING *`,
    [job_id, data.name, data.email, data.resume]
  );
};

// Get all applications
export const getApplications = () => {
  return pool.query("SELECT * FROM applications");
};

// Update application status
export const updateStatus = (id, status) => {
  return pool.query(
    "UPDATE applications SET status=$1 WHERE id=$2",
    [status, id]
  );
};

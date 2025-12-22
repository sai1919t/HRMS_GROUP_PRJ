import pool from "../db/db.js"; // db

export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      employee_id VARCHAR(50) DEFAULT '',
      fullname VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      designation VARCHAR(100) DEFAULT '',
      job_title VARCHAR(100) DEFAULT '',
      department VARCHAR(100) DEFAULT '',
      phone VARCHAR(50) DEFAULT '',
      date_of_joining DATE,
      status VARCHAR(20) DEFAULT 'ACTIVE',
      role VARCHAR(20) DEFAULT 'Employee',
      profile_picture TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    // Ensure columns exist for older databases
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50) DEFAULT ''`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(100) DEFAULT ''`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(100) DEFAULT ''`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT ''`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT ''`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_joining DATE`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE'`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'Employee'`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS location_city VARCHAR(255) DEFAULT ''`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS location_country VARCHAR(255) DEFAULT ''`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT ''`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'Not Specified'`);
    console.log("✅ Users table created/updated successfully");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
  }
};

export const createUser = async (
  fullname,
  email,
  password,
  designation = '',
  job_title = '',
  department = '',
  phone = '',
  date_of_joining = null,
  employee_id = '',
  profile_picture = '',
  status = 'ACTIVE',
  role = 'Employee',
  gender = 'Not Specified'
) => {
  const query = `
    INSERT INTO users (employee_id, fullname, email, password, designation, job_title, department, phone, date_of_joining, status, profile_picture, role, gender)
    VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *;
  `;
  const values = [employee_id, fullname, email, password, designation, job_title, department, phone, date_of_joining, status, profile_picture, role, gender];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updateUserProfile = async (id, fullname, email, designation, profile_picture, gender) => {
  // Properly order SQL parameters. When profile_picture is not provided, gender should be $4 and id $5.
  let query = `
        UPDATE users 
        SET fullname = $1, email = $2, designation = $3, gender = $4
        WHERE id = $5
        RETURNING *;
    `;
  let values = [fullname, email, designation, gender, id];

  if (profile_picture) {
    // When profile_picture is provided, profile_picture is $4, gender $5 and id $6
    query = `
            UPDATE users 
            SET fullname = $1, email = $2, designation = $3, profile_picture = $4, gender = $5
            WHERE id = $6
            RETURNING *;
        `;
    values = [fullname, email, designation, profile_picture, gender, id];
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
  const allowed = [
    "employee_id",
    "fullname",
    "email",
    "password",
    "designation",
    "job_title",
    "department",
    "phone",
    "date_of_joining",
    "status",
    "profile_picture",
    "location_city",
    "location_city",
    "location_country",
    "gender",
  ];
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

  const query = `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING id, employee_id, fullname, email, designation, job_title, department, phone, date_of_joining, status, profile_picture, gender, role, created_at`;
  values.push(id);
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllUsers = async () => {
  const query = `SELECT id, employee_id, fullname, email, designation, job_title, department, phone, date_of_joining, status, profile_picture, gender, points, role, created_at FROM users ORDER BY points DESC, fullname`;
  const { rows } = await pool.query(query);
  return rows;
};

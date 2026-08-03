import pool from "../config/db.js";

async function findByEmail(email) {
  const query = `
    SELECT * FROM users WHERE email = $1`;

  const result = await pool.query(query, [email]);

  return result.rows[0];
}

async function create(name, email, password) {
  const query = `
    INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING*`;

  const result = await pool.query(query, [name, email, password]);

  return result.rows[0];
}

async function updatePassword(email, password) {
  const query = `
  UPDATE users SET password = $1 WHERE email  = $2 RETURNING id,name,email,created_at`;

  const result = await pool.query(query, [password, email]);

  return result.rows[0];
}
export default {
  findByEmail,
  create,
  updatePassword,
};

import pool from "../config/db.js";

async function getProfile(userId) {
  const query = `
    SELECT
      id,
      name,
      email,
      phone,
      birth_date,
      gender,
      avatar_url,
      created_at
    FROM users
    WHERE id = $1;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

async function updateProfile(
  userId,
  name,
  email,
  phone,
  birthDate,
  gender,
  avatarUrl,
) {
  const query = `
    UPDATE users
    SET
      name = $2,
      email = $3,
      phone = $4,
      birth_date = $5,
      gender = $6,
      avatar_url = $7
    WHERE id = $1
    RETURNING
      id,
      name,
      email,
      phone,
      birth_date,
      gender,
      avatar_url,
      created_at;
  `;

  const result = await pool.query(query, [
    userId,
    name,
    email,
    phone,
    birthDate,
    gender,
    avatarUrl,
  ]);

  return result.rows[0];
}

async function updatePassword(userId, password) {
  const query = `
    UPDATE users
    SET password=$2
    WHERE id =$1
    RETURNING id;
    `;

  const result = await pool.query(query, [userId, password]);

  return result.rows[0];
}

async function getPassword(userId) {
  const query = `
    SELECT password FROM users
    WHERE id=$1`;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

export default {
  getProfile,
  updateProfile,
  updatePassword,
  getPassword,
};

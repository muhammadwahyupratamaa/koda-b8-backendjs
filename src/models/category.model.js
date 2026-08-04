import pool from "../config/db.js";

async function getAll() {
  const query = `
    SELECT * FROM categories ORDER BY id ASC`;

  const result = await pool.query(query);
  return result.rows;
}

export default {
  getAll,
};

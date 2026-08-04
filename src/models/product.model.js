import pool from "../config/db.js";

async function getAll() {
  const query = `
    SELECT * FROM products ORDER BY id DESC`;

  const result = await pool.query(query);
  return result.rows;
}

async function getById(id) {
  const query = `
    SELECT * FROM products WHERE id=$1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}
export default {
  getAll,
  getById,
};

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

async function getByCategory(categoryId) {
  const query = `
    SELECT p.*, c.name AS category
    FROM products p 
    JOIN categories c 
    ON p.category_id = c.id
    WHERE p.category_id = $1
    ORDER BY p.id DESC`;

  const result = await pool.query(query, [categoryId]);

  return result.rows;
}

export default {
  getAll,
  getById,
  getByCategory,
};

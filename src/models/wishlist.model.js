import pool from "../config/db.js";

async function addProduct(userId, productId) {
  const query = `
    INSERT INTO wishlists (user_id, product_id) VALUES($1, $2) RETURNING *`;

  const result = await pool.query(query, [userId, productId]);

  return result.rows[0];
}

async function removeProduct(userId, productId) {
  const query = `
    DELETE FROM wishlists WHERE user_id=$1 AND product_id=$2 RETURNING *`;

  const result = await pool.query(query, [userId, productId]);
  return result.rows[0];
}

async function getAll(userId) {
  const query = `
    SELECT
      w.id,
      p.id AS product_id,
      p.name,
      p.brand,
      p.price,
      p.price_disc,
      p.discount,
      p.rating,
      p.review,
      p.image_url
    FROM wishlists w
    JOIN products p
      ON w.product_id = p.id
    WHERE w.user_id = $1
    ORDER BY w.created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
}

export default {
  addProduct,
  removeProduct,
  getAll,
};

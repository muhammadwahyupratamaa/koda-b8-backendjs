import pool from "../config/db.js";

async function getCart(userId) {
  const query = `
    SELECT *
    FROM carts
    WHERE user_id = $1
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0];
}

async function createCart(userId) {
  const query = `
    INSERT INTO carts (user_id)
    VALUES ($1)
    RETURNING *;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0];
}

async function addProduct(cartId, productId, color) {
  const normalizedColor = color ?? null;

  const checkQuery = `
    SELECT *
    FROM cart_items
    WHERE cart_id = $1
      AND product_id = $2
      AND (
        color = $3
        OR (color IS NULL AND $3 IS NULL)
      );
  `;

  const check = await pool.query(checkQuery, [
    cartId,
    productId,
    normalizedColor,
  ]);

  if (check.rows.length > 0) {
    const updateQuery = `
      UPDATE cart_items
      SET quantity = quantity + 1,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const updated = await pool.query(updateQuery, [check.rows[0].id]);

    return updated.rows[0];
  }

  const insertQuery = `
    INSERT INTO cart_items (cart_id, product_id, color)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const inserted = await pool.query(insertQuery, [
    cartId,
    productId,
    normalizedColor,
  ]);

  return inserted.rows[0];
}

async function updateQuantity(cartId, productId, quantity) {
  const query = `
    UPDATE cart_items
    SET quantity = $3,
        updated_at = NOW()
    WHERE cart_id = $1
      AND product_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [cartId, productId, quantity]);

  return result.rows[0];
}

async function removeProduct(cartId, productId) {
  const query = `
    DELETE FROM cart_items
    WHERE cart_id = $1
      AND product_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [cartId, productId]);

  return result.rows[0];
}

async function getAll(cartId) {
  const query = `
    SELECT
      ci.id,
      ci.quantity,
      ci.color,

      p.id AS product_id,
      p.name,
      p.brand,
      p.price,
      p.price_disc,
      p.discount,
      p.image_url,
      p.stock

    FROM cart_items ci
    JOIN products p
      ON ci.product_id = p.id

    WHERE ci.cart_id = $1

    ORDER BY ci.created_at DESC;
  `;

  const result = await pool.query(query, [cartId]);

  return result.rows;
}

export default {
  getCart,
  createCart,
  addProduct,
  updateQuantity,
  removeProduct,
  getAll,
};

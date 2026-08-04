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

async function addProduct(cartId, productId) {
  const query = `
    INSERT INTO cart_items (cart_id, product_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const result = await pool.query(query, [cartId, productId]);

  return result.rows[0];
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

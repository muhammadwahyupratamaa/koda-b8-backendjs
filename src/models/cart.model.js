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

  const productQuery = `
    SELECT id, stock
    FROM products
    WHERE id = $1;
  `;

  const productResult = await pool.query(productQuery, [productId]);
  const product = productResult.rows[0];

  if (!product) {
    const error = new Error("Produk tidak ditemukan");
    error.code = "PRODUCT_NOT_FOUND";
    throw error;
  }

  if (product.stock <= 0) {
    const error = new Error("Stock produk habis");
    error.code = "OUT_OF_STOCK";
    throw error;
  }

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
    const currentItem = check.rows[0];

    if (currentItem.quantity >= product.stock) {
      const error = new Error("Jumlah produk sudah mencapai stock");
      error.code = "STOCK_INSUFFICIENT";
      throw error;
    }

    const updateQuery = `
      UPDATE cart_items
      SET quantity = quantity + 1,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const updated = await pool.query(updateQuery, [
      currentItem.id,
    ]);

    return updated.rows[0];
  }

  const insertQuery = `
    INSERT INTO cart_items (
      cart_id,
      product_id,
      color
    )
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

async function updateQuantity(cartId, cartItemId, quantity) {
  const query = `
    UPDATE cart_items ci
    SET quantity = $3,
        updated_at = NOW()
    FROM products p
    WHERE ci.cart_id = $1
      AND ci.id = $2
      AND ci.product_id = p.id
      AND $3 > 0
      AND $3 <= p.stock
    RETURNING ci.*;
  `;

  const result = await pool.query(query, [cartId, cartItemId, quantity]);

  return result.rows[0];
}

async function getCartItem(cartId, cartItemId) {
  const query = `
    SELECT
      ci.*,
      p.stock
    FROM cart_items ci
    JOIN products p
      ON ci.product_id = p.id
    WHERE ci.cart_id = $1
      AND ci.id = $2;
  `;

  const result = await pool.query(query, [cartId, cartItemId]);

  return result.rows[0];
}

async function removeProduct(cartId, cartItemId) {
  const query = `
    DELETE FROM cart_items
    WHERE cart_id = $1
      AND id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [cartId, cartItemId]);

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
  getCartItem,
  removeProduct,
  getAll,
};

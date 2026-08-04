import pool from "../config/db.js";

async function getCartItems(cartId) {
  const query = `
    SELECT
      ci.product_id,
      ci.quantity,
      p.price
    FROM cart_items ci
    JOIN products p
      ON ci.product_id = p.id
    WHERE ci.cart_id = $1;
  `;

  const result = await pool.query(query, [cartId]);

  return result.rows;
}

async function createOrder(userId, total) {
  const query = `
    INSERT INTO orders (user_id, total)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const result = await pool.query(query, [userId, total]);

  return result.rows[0];
}
async function createOrderItem(orderId, productId, quantity, price, subtotal) {
  const query = `
    INSERT INTO order_items
    (
      order_id,
      product_id,
      quantity,
      price,
      subtotal
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    orderId,
    productId,
    quantity,
    price,
    subtotal,
  ]);

  return result.rows[0];
}

async function clearCart(cartId) {
  const query = `
    DELETE FROM cart_items
    WHERE cart_id = $1;
  `;

  await pool.query(query, [cartId]);
}

async function getOrders(userId) {
  const query = `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
}

export default {
  getCartItems,
  createOrder,
  createOrderItem,
  clearCart,
  getOrders,
};

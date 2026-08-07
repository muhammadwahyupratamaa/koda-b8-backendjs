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
    SELECT
      o.id,
      o.total,
      o.created_at,

      oi.quantity,
      oi.price,
      oi.subtotal,

      p.name,
      p.image_url

    FROM orders o

    JOIN order_items oi
      ON oi.order_id = o.id

    JOIN products p
      ON p.id = oi.product_id

    WHERE o.user_id = $1

    ORDER BY o.created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  const orders = [];

  for (const row of result.rows) {
    let order = orders.find((o) => o.id === row.id);

    if (!order) {
      order = {
        id: row.id,
        total: row.total,
        created_at: row.created_at,
        status: "Diproses",
        items: [],
      };

      orders.push(order);
    }

    order.items.push({
      name: row.name,
      image_url: row.image_url,
      quantity: row.quantity,
      price: row.price,
      subtotal: row.subtotal,
    });
  }

  return orders;
}

export default {
  getCartItems,
  createOrder,
  createOrderItem,
  clearCart,
  getOrders,
};

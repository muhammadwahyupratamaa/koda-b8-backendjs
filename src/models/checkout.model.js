import pool from "../config/db.js";

async function getCartItems(cartId, client = pool) {
  const query = `
    SELECT
      ci.product_id,
      ci.quantity,
      p.price,
      p.stock
    FROM cart_items ci
    JOIN products p
      ON ci.product_id = p.id
    WHERE ci.cart_id = $1
    FOR UPDATE OF p;
  `;

  const result = await client.query(query, [cartId]);

  return result.rows;
}

async function createOrder(
  userId,
  total,
  shippingAddress,
  paymentMethod,
  client = pool,
) {
  const query = `
    INSERT INTO orders (
      user_id,
      total,
      shipping_address,
      payment_method
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const result = await client.query(query, [
    userId,
    total,
    shippingAddress,
    paymentMethod,
  ]);

  return result.rows[0];
}

async function createOrderItem(
  orderId,
  productId,
  quantity,
  price,
  subtotal,
  client = pool,
) {
  const query = `
    INSERT INTO order_items
    (
      order_id,
      product_id,
      quantity,
      price,
      subtotal
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const result = await client.query(query, [
    orderId,
    productId,
    quantity,
    price,
    subtotal,
  ]);

  return result.rows[0];
}

async function decreaseStock(
  productId,
  quantity,
  client = pool,
) {
  const query = `
    UPDATE products
    SET stock = stock - $2
    WHERE id = $1
    RETURNING *;
  `;

  const result = await client.query(query, [
    productId,
    quantity,
  ]);

  return result.rows[0];
}

async function clearCart(cartId, client = pool) {
  const query = `
    DELETE FROM cart_items
    WHERE cart_id = $1;
  `;

  await client.query(query, [cartId]);
}

async function getOrders(userId) {
  const query = `
    SELECT
      o.id,
      o.total,
      o.status,
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
      let status = "Diproses";

      if (row.status === "shipped") {
        status = "Dikirim";
      } else if (row.status === "delivered") {
        status = "Terkirim";
      }

      order = {
        id: row.id,
        total: row.total,
        created_at: row.created_at,
        status,
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
  decreaseStock,
  clearCart,
  getOrders,
};
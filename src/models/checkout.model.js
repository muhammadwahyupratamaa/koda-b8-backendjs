import { Op } from "sequelize";
import { CartItem, Product, Order, OrderItem } from "./index.js";

async function getCartItems(cartId, transaction) {
  return await CartItem.findAll({
    where: {
      cart_id: cartId,
    },
    attributes: ["product_id", "quantity"],
    include: {
      model: Product,
      attributes: ["id", "price", "stock"],
      required: true,
    },
    transaction,
  });
}

async function createOrder(
  userId,
  total,
  shippingAddress,
  paymentMethod,
  transaction,
) {
  return await Order.create(
    {
      user_id: userId,
      total,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
    },
    {
      transaction,
    },
  );
}

async function createOrderItem(
  orderId,
  productId,
  quantity,
  price,
  subtotal,
  transaction,
) {
  return await OrderItem.create(
    {
      order_id: orderId,
      product_id: productId,
      quantity,
      price,
      subtotal,
    },
    {
      transaction,
    },
  );
}

async function decreaseStock(productId, quantity, transaction) {
  const product = await Product.findByPk(productId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!product) {
    throw new Error("Produk tidak ditemukan");
  }

  if (product.stock < quantity) {
    const error = new Error("Stock produk tidak cukup");
    error.code = "STOCK_INSUFFICIENT";
    throw error;
  }

  product.stock -= quantity;

  await product.save({
    transaction,
  });

  return product;
}

async function clearCart(cartId, transaction) {
  await CartItem.destroy({
    where: {
      cart_id: cartId,
    },

    transaction,
  });
}

async function getOrders(userId) {
  const orderItems = await OrderItem.findAll({
    attributes: ["id", "order_id", "quantity", "price", "subtotal"],

    include: [
      {
        model: Order,
        where: {
          user_id: userId,
        },
        attributes: ["id", "total", "status", "created_at"],
      },
      {
        model: Product,
        attributes: ["name", "image_url"],
      },
    ],

    order: [[Order, "created_at", "DESC"]],

    raw: true,
  });

  const orders = [];

  for (const row of orderItems) {
    let order = orders.find(
      (item) => String(item.id) === String(row["Order.id"]),
    );

    if (!order) {
      let status = "Diproses";

      if (row["Order.status"] === "shipped") {
        status = "Dikirim";
      } else if (row["Order.status"] === "delivered") {
        status = "Terkirim";
      }

      order = {
        id: row["Order.id"],
        total: row["Order.total"],
        created_at: row["Order.created_at"],
        status,
        items: [],
      };

      orders.push(order);
    }

    order.items.push({
      name: row["Product.name"],
      image_url: row["Product.image_url"],
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

import { constants } from "node:http2";
import pool from "../config/db.js";
import cartModel from "../models/cart.model.js";
import checkoutModel from "../models/checkout.model.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function checkout(req, res) {
  const client = await pool.connect();

  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await cartModel.getCart(userId);

    if (!cart) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Not Found",
      });
    }

    await client.query("BEGIN");

    const cartItems = await checkoutModel.getCartItems(cart.id, client);

    if (cartItems.length === 0) {
      await client.query("ROLLBACK");

      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Cart is empty",
      });
    }

    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");

        return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Stock produk tidak cukup",
        });
      }
    }

    let total = 0;

    for (const item of cartItems) {
      total += Number(item.price) * item.quantity;
    }

    const order = await checkoutModel.createOrder(
      userId,
      total,
      shippingAddress,
      paymentMethod,
      client,
    );

    for (const item of cartItems) {
      const subtotal = Number(item.price) * item.quantity;

      await checkoutModel.createOrderItem(
        order.id,
        item.product_id,
        item.quantity,
        item.price,
        subtotal,
        client,
      );

      await checkoutModel.decreaseStock(item.product_id, item.quantity, client);
    }

    await checkoutModel.clearCart(cart.id, client);

    await client.query("COMMIT");

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Checkout success",
      data: order,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(constants.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Data sudah ada",
      });
    }

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  } finally {
    client.release();
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function getOrders(req, res) {
  try {
    const userId = req.user.id;

    const orders = await checkoutModel.getOrders(userId);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export default {
  checkout,
  getOrders,
};

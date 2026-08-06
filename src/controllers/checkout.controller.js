import { constants } from "node:http2";
import cartModel from "../models/cart.model.js";
import checkoutModel from "../models/checkout.model.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function checkout(req, res) {
  try {
    const userId = req.user.id;
    const cart = await cartModel.getCart(userId);

    if (!cart) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Not Found",
      });
    }
    const cartItems = await checkoutModel.getCartItems(cart.id);

    if (cartItems.length === 0) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let total = 0;
    for (const item of cartItems) {
      total += item.price * item.quantity;
    }
    const order = await checkoutModel.createOrder(userId, total);

    for (const item of cartItems) {
      const subtotal = item.price * item.quantity;
      await checkoutModel.createOrderItem(
        order.id,
        item.product_id,
        item.quantity,
        item.price,
        subtotal,
      );
    }

    await checkoutModel.clearCart(cart.id);

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Checkout success",
      data: order,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 *
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

import { constants } from "node:http2";
import sequelize from "../config/sequelize.js";
import cartModel from "../models/cart.model.js";
import checkoutModel from "../models/checkout.model.js";
import { broadcast } from "../websocket/index.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function checkout(req, res) {
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

    const order = await sequelize.transaction(async (transaction) => {
      const cartItems = await checkoutModel.getCartItems(cart.id, transaction);

      if (cartItems.length === 0) {
        const error = new Error("Cart is empty");
        error.code = "CART_EMPTY";
        throw error;
      }

      let total = 0;

      for (const item of cartItems) {
        const stock = item.Product.stock;
        const quantity = item.quantity;

        if (stock < quantity) {
          const error = new Error("Stock produk tidak cukup");
          error.code = "STOCK_INSUFFICIENT";
          throw error;
        }

        total += Number(item.Product.price) * quantity;
      }

      const newOrder = await checkoutModel.createOrder(
        userId,
        total,
        shippingAddress,
        paymentMethod,
        transaction,
      );

      for (const item of cartItems) {
        const price = Number(item.Product.price);
        const subtotal = price * item.quantity;

        await checkoutModel.createOrderItem(
          newOrder.id,
          item.product_id,
          item.quantity,
          price,
          subtotal,
          transaction,
        );

        await checkoutModel.decreaseStock(
          item.product_id,
          item.quantity,
          transaction,
        );
      }

      await checkoutModel.clearCart(cart.id, transaction);

      return newOrder;
    });

    // Transaction sudah berhasil COMMIT.
    // Baru broadcast order ke WebSocket admin.
    broadcast("order_created", order);

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Checkout success",
      data: order,
    });
  } catch (error) {
    if (error.code === "CART_EMPTY") {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (error.code === "STOCK_INSUFFICIENT") {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Stock produk tidak cukup",
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(constants.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Data sudah ada",
      });
    }

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
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

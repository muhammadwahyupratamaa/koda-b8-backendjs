import { constants } from "node:http2";
import cartModel from "../models/cart.model.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function addProduct(req, res) {
  try {
    const userId = req.user.id;
    const { productId, color } = req.body;

    let cart = await cartModel.getCart(userId);

    if (!cart) {
      cart = await cartModel.createCart(userId);
    }

    const cartItem = await cartModel.addProduct(cart.id, productId, color);

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      data: cartItem,
    });
  } catch (error) {
    if (error.code === "PRODUCT_NOT_FOUND") {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    if (error.code === "OUT_OF_STOCK" || error.code === "STOCK_INSUFFICIENT") {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === "23505") {
      return res.status(constants.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Produk sudah ada di keranjang",
      });
    }

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
async function updateQuantity(req, res) {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.getCart(userId);

    if (!cart) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = await cartModel.getCartItem(cart.id, cartItemId);

    if (!cartItem) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Quantity harus lebih dari 0",
      });
    }

    if (quantity > cartItem.stock) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: `Stock produk hanya tersedia ${cartItem.stock}`,
      });
    }

    const item = await cartModel.updateQuantity(cart.id, cartItemId, quantity);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: item,
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
async function removeProduct(req, res) {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;

    const cart = await cartModel.getCart(userId);

    if (!cart) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = await cartModel.removeProduct(cart.id, cartItemId);

    if (!item) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: item,
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
async function getAll(req, res) {
  try {
    const userId = req.user.id;

    const cart = await cartModel.getCart(userId);

    if (!cart) {
      return res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        data: [],
      });
    }

    const items = await cartModel.getAll(cart.id);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: items,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export default {
  addProduct,
  updateQuantity,
  removeProduct,
  getAll,
};

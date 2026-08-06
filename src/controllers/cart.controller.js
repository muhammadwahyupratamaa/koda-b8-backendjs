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
    const { productId } = req.body;

    let cart = await cartModel.getCart(userId);

    if (!cart) {
      cart = await cartModel.createCart(userId);
    }

    const cartItem = await cartModel.addProduct(cart.id, productId);

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      data: cartItem,
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
async function updateQuantity(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.getCart(userId);

    if (!cart) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = await cartModel.updateQuantity(cart.id, productId, quantity);

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
    const { productId } = req.params;

    const cart = await cartModel.getCart(userId);

    if (!cart) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = await cartModel.removeProduct(cart.id, productId);

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

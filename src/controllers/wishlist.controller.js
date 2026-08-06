import wishlistModel from "../models/wishlist.model.js";
import { constants } from "node:http2";

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
    const wishlist = await wishlistModel.addProduct(userId, productId);

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      data: wishlist,
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

    const wishlist = await wishlistModel.removeProduct(userId, productId);

    if (!wishlist) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: wishlist,
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
    const wishlist = await wishlistModel.getAll(userId);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: wishlist,
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
  removeProduct,
  getAll,
};

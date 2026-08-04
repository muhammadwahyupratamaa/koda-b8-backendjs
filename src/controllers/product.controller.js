import { constants } from "node:http2";
import productModel from "../models/product.model.js";

async function getAll(req, res) {
  try {
    const products = await productModel.getAll();

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.getById(id);

    if (!product) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "product not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function getByCategory(req, res) {
  try {
    const { id } = req.params;
    const products = await productModel.getByCategory(id);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export default {
  getAll,
  getById,
  getByCategory,
};

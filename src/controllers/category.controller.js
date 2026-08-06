import categoryModel from "../models/category.model.js";
import { constants } from "node:http2";



/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function getAll(req, res) {
  try {
    const categories = await categoryModel.getAll();

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: categories,
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
};

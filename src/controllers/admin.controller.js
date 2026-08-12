import { constants } from "node:http2";
import { Category, Product } from "../models/index.js";

async function getProducts(req, res) {
  try {
    const product = await Product.findAll({
      include: {
        model: Category,
        attributes: ["name"],
      },
      order: [["id", "DESC"]],
    });

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
export default {
  getProducts,
};

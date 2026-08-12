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

async function getProductByID(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: {
        model: Category,
        attributes: ["name"],
      },
    });

    if (!product) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Product Not Found",
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

async function createProduct(req, res) {
  try {
    const newProduct = await Product.create(req.body);

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Create Product Successfully",
      data: newProduct,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Product Not Found",
      });
    }

    const {
      name,
      brand,
      category_id,
      price,
      price_disc,
      discount,
      rating,
      review,
      sold,
      stock,
      is_featured,
      image_url,
      description,
    } = req.body;

    await product.update({
      name,
      brand,
      category_id,
      price,
      price_disc,
      discount,
      rating,
      review,
      sold,
      stock,
      is_featured,
      image_url,
      description,
    });

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update Product Successfully",
      data: product,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Product Not Found",
      });
    }

    await product.destroy();

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: " Delete Product Successfully",
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
  getProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
};

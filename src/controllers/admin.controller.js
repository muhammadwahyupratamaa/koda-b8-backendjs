import { constants } from "node:http2";
import { Category, Product, Order, OrderItem } from "../models/index.js";
import { broadcast } from "../websocket/index.js";

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

async function getOrders(req, res) {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          attributes: ["id", "product_id", "quantity", "price", "subtotal"],
          include: {
            model: Product,
            attributes: ["name", "image_url"],
          },
        },
      ],
      order: [["created_at", "DESC"]],
    });

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

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "processing", "shipped", "delivered"];

    if (!allowedStatus.includes(status)) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Order Not Found",
      });
    }

    await order.update({
      status,
    });

    broadcast("order_status_updated", order);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update Order Status Successfully",
      data: order,
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
  getOrders,
  updateOrderStatus,
};

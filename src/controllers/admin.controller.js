import { constants } from "node:http2";
import { Category, Product, Order, OrderItem } from "../models/index.js";
import { broadcast, broadcastToUser } from "../websocket/index.js";
import { Op } from "sequelize";

async function getProducts(req, res) {
  try {
    const {
      search = "",
      category_id,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 100);

    const offset = (currentPage - 1) * perPage;

    const where = {};

    if (search.trim()) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search.trim()}%`,
          },
        },
        {
          brand: {
            [Op.iLike]: `%${search.trim()}%`,
          },
        },
      ];
    }

    if (category_id) {
      where.category_id = category_id;
    }

    if (status === "active") {
      where.stock = {
        [Op.gt]: 0,
      };
    }

    if (status === "promo") {
      where.price_disc = {
        [Op.gt]: 0,
      };
    }

    if (status === "inactive") {
      where.stock = 0;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,

      include: {
        model: Category,
        attributes: ["name"],
      },

      order: [["id", "DESC"]],

      limit: perPage,
      offset,
    });

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: rows,
      pagination: {
        page: currentPage,
        limit: perPage,
        total: count,
        totalPages: Math.ceil(count / perPage),
      },
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

    const statusFlow = {
      pending: "processing",
      processing: "shipped",
      shipped: "delivered",
      delivered: null,
    };

    const currentStatus = order.status;
    const nextStatus = statusFlow[currentStatus];

    if (currentStatus === "delivered") {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Order sudah terkirim",
      });
    }

    if (status !== nextStatus) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: `Status harus berubah dari ${currentStatus} ke ${nextStatus}`,
      });
    }

    await order.update({
      status,
    });

    // Update semua admin yang sedang membuka panel
    broadcast("order_status_updated", order);

    // Update user pemilik order secara realtime
    broadcastToUser(order.user_id, "order_status_updated", order);

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

async function getProductStatistics(req, res) {
  try {
    const [total, active, lowStock, promo] = await Promise.all([
      Product.count(),

      Product.count({
        where: {
          stock: {
            [Op.gt]: 0,
          },
        },
      }),

      Product.count({
        where: {
          stock: {
            [Op.gt]: 0,
            [Op.lte]: 10,
          },
        },
      }),

      Product.count({
        where: {
          price_disc: {
            [Op.gt]: 0,
          },
        },
      }),
    ]);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: {
        total,
        active,
        lowStock,
        promo,
      },
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function getOrderStatistics(req, res) {
  try {
    const [total, pending, processing, shipped, delivered] = await Promise.all([
      Order.count(),

      Order.count({
        where: {
          status: "pending",
        },
      }),

      Order.count({
        where: {
          status: "processing",
        },
      }),

      Order.count({
        where: {
          status: "shipped",
        },
      }),

      Order.count({
        where: {
          status: "delivered",
        },
      }),
    ]);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: {
        total,
        pending,
        processing,
        shipped,
        delivered,
      },
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
  getProductStatistics,
  getOrderStatistics,
};

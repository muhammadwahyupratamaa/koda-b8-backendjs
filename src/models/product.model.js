// import Category from "./category.js";
// import Product from "./product.js";

import { Op } from "sequelize";
import sequelize from "../config/sequelize.js";
import { Category, Product } from "./index.js";

async function getAll({
  search = "",
  category_id,
  min_price,
  max_price,
  sort = "newest",
} = {}) {
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

  if (min_price || max_price) {
    where.price = {};

    if (min_price) {
      where.price[Op.gte] = Number(min_price);
    }

    if (max_price) {
      where.price[Op.lte] = Number(max_price);
    }
  }

  let order = [["id", "DESC"]];

  if (sort === "price_asc") {
    order = [["price", "ASC"]];
  }

  if (sort === "price_desc") {
    order = [["price", "DESC"]];
  }

  return await Product.findAll({
    where,
    attributes: {
      include: [[sequelize.col("Category.name"), "category"]],
    },
    include: {
      model: Category,
      attributes: [],
    },
    order,
    raw: true,
  });
}

async function getById(id) {
  return await Product.findByPk(id);
}

async function getByCategory(categoryId) {
  return await Product.findAll({
    where: {
      category_id: categoryId,
    },
    include: {
      model: Category,
      attributes: [],
    },
    attributes: {
      include: [[sequelize.col("Category.name"), "category"]],
    },
    order: [["id", "DESC"]],
    raw: true,
  });
}

export default {
  getAll,
  getById,
  getByCategory,
};

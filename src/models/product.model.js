// import Category from "./category.js";
// import Product from "./product.js";

import sequelize from "../config/sequelize.js";
import { Category, Product } from "./index.js";

async function getAll() {
  return await Product.findAll({
    attributes: {
      include: [[sequelize.col("Category.name"), "category"]],
    },
    include: {
      model: Category,
      attributes: [],
    },
    order: [["id", "DESC"]],
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

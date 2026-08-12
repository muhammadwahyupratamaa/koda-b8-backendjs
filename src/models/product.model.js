// import Category from "./category.js";
// import Product from "./product.js";

import { Category, Product } from "./index.js";

async function getAll() {
  return await Product.findAll({
    include: {
      model: Category,
      attributes: ["name"],
    },
    order: [["id", "DESC"]],
  });
}

async function getById(id) {
  const query = `
    SELECT * FROM products WHERE id=$1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

async function getByCategory(categoryId) {
  const query = `
    SELECT p.*, c.name AS category
    FROM products p 
    JOIN categories c 
    ON p.category_id = c.id
    WHERE p.category_id = $1
    ORDER BY p.id DESC`;

  const result = await pool.query(query, [categoryId]);

  return result.rows;
}

export default {
  getAll,
  getById,
  getByCategory,
};

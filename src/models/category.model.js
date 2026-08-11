import pool from "../config/db.js";
import Category from "./category.js";

async function getAll() {
  const query = `
    SELECT * FROM categories ORDER BY id ASC`;

  return await Category.findAll({
    order:[["id", "ASC"]]
  })
}

export default {
  getAll,
};

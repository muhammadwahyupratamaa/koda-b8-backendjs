import Category from "./category.js";

async function getAll() {
  return await Category.findAll({
    order: [["id", "ASC"]],
  });
}

export default {
  getAll,
};

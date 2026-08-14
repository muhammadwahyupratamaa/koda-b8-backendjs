import sequelize from "../config/sequelize.js";
import { Wishlist, Product } from "./index.js";

async function addProduct(userId, productId) {
  return await Wishlist.create({
    user_id: userId,
    product_id: productId,
  });
}

async function removeProduct(userId, productId) {
  const wishlist = await Wishlist.findOne({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });

  if (!wishlist) {
    return null;
  }

  await wishlist.destroy();

  return wishlist;
}

async function getAll(userId) {
  return await Wishlist.findAll({
    where: {
      user_id: userId,
    },

    attributes: [
      "id",
      "product_id",
      [sequelize.col("Product.name"), "name"],
      [sequelize.col("Product.brand"), "brand"],
      [sequelize.col("Product.price"), "price"],
      [sequelize.col("Product.price_disc"), "price_disc"],
      [sequelize.col("Product.discount"), "discount"],
      [sequelize.col("Product.rating"), "rating"],
      [sequelize.col("Product.review"), "review"],
      [sequelize.col("Product.image_url"), "image_url"],
    ],

    include: {
      model: Product,
      attributes: [],
    },

    order: [["created_at", "DESC"]],

    raw: true,
  });
}

export default {
  addProduct,
  removeProduct,
  getAll,
};
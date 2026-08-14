import User from "./user.js";
import Category from "./category.js";
import Product from "./product.js";

Category.hasMany(Product, {
  foreignKey: "category_id",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

export { User, Category, Product };

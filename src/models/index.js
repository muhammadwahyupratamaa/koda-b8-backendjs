import User from "./user.js";
import Address from "./address.js";
import Category from "./category.js";
import Product from "./product.js";

User.hasMany(Address, {
  foreignKey: "user_id",
});

Address.belongsTo(User, {
  foreignKey: "user_id",
});

Category.hasMany(Product, {
  foreignKey: "category_id",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

export { User, Address, Category, Product };

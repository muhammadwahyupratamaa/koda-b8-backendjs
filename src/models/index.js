import User from "./user.js";
import Address from "./address.js";
import Category from "./category.js";
import Product from "./product.js";
import Wishlist from "./wishlist.js";

User.hasMany(Address, {
  foreignKey: "user_id",
});

Address.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Wishlist, {
  foreignKey: "user_id",
});

Wishlist.belongsTo(User, {
  foreignKey: "user_id",
});

Product.hasMany(Wishlist, {
  foreignKey: "product_id",
});

Wishlist.belongsTo(Product, {
  foreignKey: "product_id",
});

Category.hasMany(Product, {
  foreignKey: "category_id",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

export { User, Address, Category, Product, Wishlist };

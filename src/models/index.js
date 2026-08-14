import User from "./user.js";
import Address from "./address.js";
import Category from "./category.js";
import Product from "./product.js";
import Wishlist from "./wishlist.js";
import Cart from "./cart.js";
import CartItem from "./cartItem.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";

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

User.hasOne(Cart, {
  foreignKey: "user_id",
});

Cart.belongsTo(User, {
  foreignKey: "user_id",
});

Cart.hasMany(CartItem, {
  foreignKey: "cart_id",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cart_id",
});

Product.hasMany(CartItem, {
  foreignKey: "product_id",
});

CartItem.belongsTo(Product, {
  foreignKey: "product_id",
});

User.hasMany(Order, {
  foreignKey: "user_id",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
});

Order.hasMany(OrderItem, {
  foreignKey: "order_id",
});

OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
});

Product.hasMany(OrderItem, {
  foreignKey: "product_id",
});

OrderItem.belongsTo(Product, {
  foreignKey: "product_id",
});

Category.hasMany(Product, {
  foreignKey: "category_id",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

export {
  User,
  Address,
  Category,
  Product,
  Wishlist,
  Cart,
  CartItem,
  Order,
  OrderItem,
};

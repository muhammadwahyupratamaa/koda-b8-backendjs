import { Cart, CartItem, Product } from "./index.js";

async function getCart(userId) {
  return await Cart.findOne({
    where: {
      user_id: userId,
    },
  });
}

async function createCart(userId) {
  return await Cart.create({
    user_id: userId,
  });
}

async function addProduct(cartId, productId, color) {
  const normalizedColor = color ?? null;

  const product = await Product.findByPk(productId, {
    attributes: ["id", "stock"],
  });

  if (!product) {
    const error = new Error("Produk tidak ditemukan");
    error.code = "PRODUCT_NOT_FOUND";
    throw error;
  }

  if (product.stock <= 0) {
    const error = new Error("Stock produk habis");
    error.code = "OUT_OF_STOCK";
    throw error;
  }

  const cartItem = await CartItem.findOne({
    where: {
      cart_id: cartId,
      product_id: productId,
      color: normalizedColor,
    },
  });

  if (cartItem) {
    if (cartItem.quantity >= product.stock) {
      const error = new Error("Jumlah produk sudah mencapai stock");
      error.code = "STOCK_INSUFFICIENT";
      throw error;
    }

    cartItem.quantity += 1;

    await cartItem.save();

    return cartItem;
  }

  return await CartItem.create({
    cart_id: cartId,
    product_id: productId,
    color: normalizedColor,
  });
}

async function updateQuantity(cartId, cartItemId, quantity) {
  const cartItem = await CartItem.findOne({
    where: {
      cart_id: cartId,
      id: cartItemId,
    },
  });

  if (!cartItem) {
    return null;
  }

  cartItem.quantity = quantity;

  await cartItem.save();

  return cartItem;
}

async function getCartItem(cartId, cartItemId) {
  const cartItem = await CartItem.findOne({
    where: {
      cart_id: cartId,
      id: cartItemId,
    },
    include: {
      model: Product,
      attributes: ["stock"],
    },
  });

  if (!cartItem) {
    return null;
  }

  return {
    ...cartItem.toJSON(),
    stock: cartItem.Product.stock,
  };
}

async function removeProduct(cartId, cartItemId) {
  const cartItem = await CartItem.findOne({
    where: {
      cart_id: cartId,
      id: cartItemId,
    },
  });

  if (!cartItem) {
    return null;
  }

  await cartItem.destroy();

  return cartItem;
}

async function getAll(cartId) {
  return await CartItem.findAll({
    where: {
      cart_id: cartId,
    },

    attributes: [
      "id",
      "quantity",
      "color",
      "product_id",
      ["created_at", "created_at"],
    ],

    include: {
      model: Product,
      attributes: [
        "name",
        "brand",
        "price",
        "price_disc",
        "discount",
        "image_url",
        "stock",
      ],
    },

    order: [["created_at", "DESC"]],

    raw: true,
  });
}

export default {
  getCart,
  createCart,
  addProduct,
  updateQuantity,
  getCartItem,
  removeProduct,
  getAll,
};

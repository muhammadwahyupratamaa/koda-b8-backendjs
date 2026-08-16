import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  // =========================
  // USERS: role
  // =========================

  const usersColumns = await queryInterface.describeTable("users");

  if (!usersColumns.role) {
    await queryInterface.addColumn("users", "role", {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "user",
    });
  }

  // =========================
  // CART ITEMS: color
  // =========================

  const cartItemColumns = await queryInterface.describeTable("cart_items");

  if (!cartItemColumns.color) {
    await queryInterface.addColumn("cart_items", "color", {
      type: DataTypes.STRING(50),
      allowNull: true,
    });
  }

  // Existing database currently has the old
  // unique_cart_product constraint.
  //
  // The final schema requires:
  // UNIQUE (cart_id, product_id, color)

  try {
    await queryInterface.removeConstraint("cart_items", "unique_cart_product");
  } catch (error) {
    // Constraint may already have been removed.
  }

  try {
    await queryInterface.addConstraint("cart_items", {
      fields: ["cart_id", "product_id", "color"],
      type: "unique",
      name: "unique_cart_product",
    });
  } catch (error) {
    // Final constraint may already exist.
  }
}

export async function down(queryInterface) {
  // Intentionally empty.
  //
  // This migration aligns an existing database.
  // Automatic rollback could remove production data/schema.
}

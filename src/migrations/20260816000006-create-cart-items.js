import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("cart_items", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    cart_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addConstraint("cart_items", {
    fields: ["cart_id"],
    type: "foreign key",
    name: "fk_cart_items_cart",
    references: {
      table: "carts",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  await queryInterface.addConstraint("cart_items", {
    fields: ["product_id"],
    type: "foreign key",
    name: "fk_cart_items_product",
    references: {
      table: "products",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  await queryInterface.addConstraint("cart_items", {
    fields: ["cart_id", "product_id", "color"],
    type: "unique",
    name: "unique_cart_product",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("cart_items");
}

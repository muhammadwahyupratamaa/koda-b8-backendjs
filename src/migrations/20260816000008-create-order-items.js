import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("order_items", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    order_id: {
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
    },

    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addConstraint("order_items", {
    fields: ["order_id"],
    type: "foreign key",
    name: "fk_order_item_order",
    references: {
      table: "orders",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  await queryInterface.addConstraint("order_items", {
    fields: ["product_id"],
    type: "foreign key",
    name: "fk_order_item_product",
    references: {
      table: "products",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("order_items");
}
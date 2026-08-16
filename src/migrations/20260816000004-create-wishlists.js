import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("wishlists", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addConstraint("wishlists", {
    fields: ["user_id", "product_id"],
    type: "unique",
    name: "unique_user_product",
  });

  await queryInterface.addConstraint("wishlists", {
    fields: ["user_id"],
    type: "foreign key",
    name: "fk_wishlist_user",
    references: {
      table: "users",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  await queryInterface.addConstraint("wishlists", {
    fields: ["product_id"],
    type: "foreign key",
    name: "fk_wishlist_product",
    references: {
      table: "products",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("wishlists");
}

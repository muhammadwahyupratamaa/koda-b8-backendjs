import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("carts", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
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

  await queryInterface.addConstraint("carts", {
    fields: ["user_id"],
    type: "unique",
    name: "carts_user_id_key",
  });

  await queryInterface.addConstraint("carts", {
    fields: ["user_id"],
    type: "foreign key",
    name: "fk_cart_user",
    references: {
      table: "users",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("carts");
}

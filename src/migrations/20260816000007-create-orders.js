import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("orders", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    total: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "pending",
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

  await queryInterface.addConstraint("orders", {
    fields: ["user_id"],
    type: "foreign key",
    name: "fk_order_user",
    references: {
      table: "users",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("orders");
}
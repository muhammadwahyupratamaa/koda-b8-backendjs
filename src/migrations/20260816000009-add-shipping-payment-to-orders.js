import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.addColumn("orders", "shipping_address", {
    type: DataTypes.TEXT,
    allowNull: true,
  });

  await queryInterface.addColumn("orders", "payment_method", {
    type: DataTypes.STRING(50),
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("orders", "payment_method");
  await queryInterface.removeColumn("orders", "shipping_address");
}
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("users", "role", {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: "user",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("users", "role");
}
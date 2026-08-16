import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "user",
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    birth_date: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class User extends Model {}

User.init(
  {
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

    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    underscored: true,

    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default User;

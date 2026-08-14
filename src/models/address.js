import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Address extends Model {}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    province: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    postal_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    is_primary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    underscored: true,

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Address;

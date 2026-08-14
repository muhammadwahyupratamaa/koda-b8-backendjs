import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "carts",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Cart;

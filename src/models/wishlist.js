import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Wishlist extends Model {}

Wishlist.init(
  {
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
  },
  {
    sequelize,
    modelName: "Wishlist",
    tableName: "wishlists",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default Wishlist;

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    underscored: true,
    timestamps: true,
  },
);

export default Category;

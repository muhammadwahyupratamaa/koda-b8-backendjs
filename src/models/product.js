import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

class Product extends Model {}

Product.init(
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

    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
    },

    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    price_disc: {
      type: DataTypes.BIGINT,
    },

    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
    },

    review: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    sold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    image_url: {
      type: DataTypes.TEXT,
    },

    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    underscored: true,
    timestamps: true,
  },
);

export default Product;
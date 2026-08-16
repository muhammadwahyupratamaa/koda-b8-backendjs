import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("products", {
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
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    price_disc: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    rating: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0,
    },

    review: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    sold: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },

    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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

  await queryInterface.addConstraint("products", {
    fields: ["category_id"],
    type: "foreign key",
    name: "fk_products_category",
    references: {
      table: "categories",
      field: "id",
    },
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("products");
}

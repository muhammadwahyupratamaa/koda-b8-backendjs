import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("addresses", {
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

  await queryInterface.addConstraint("addresses", {
    fields: ["user_id"],
    type: "foreign key",
    name: "addresses_user_id_fkey",
    references: {
      table: "users",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  });

  await queryInterface.addIndex("addresses", ["user_id"], {
    name: "unique_primary_address",
    unique: true,
    where: {
      is_primary: true,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("addresses");
}
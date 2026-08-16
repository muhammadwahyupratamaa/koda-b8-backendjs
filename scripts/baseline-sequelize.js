import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: console.log,
  },
);

const migrations = [
  "20260816000001-create-users.js",
  "20260816000002-create-categories.js",
  "20260816000003-create-products.js",
  "20260816000004-create-wishlists.js",
  "20260816000005-create-carts.js",
  "20260816000006-create-cart-items.js",
  "20260816000007-create-orders.js",
  "20260816000011-seed-categories.js",
  "20260816000012-seed-products.js",
];

try {
  await sequelize.authenticate();

  console.log("Database connection established.");

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
      "name" VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY
    );
  `);

  for (const migration of migrations) {
    await sequelize.query(
      `
      INSERT INTO "SequelizeMeta" ("name")
      VALUES (:name)
      ON CONFLICT ("name") DO NOTHING;
      `,
      {
        replacements: {
          name: migration,
        },
      },
    );
  }

  console.log("Sequelize baseline completed.");
} catch (error) {
  console.error("Sequelize baseline failed.");
  console.error(error);
  process.exit(1);
} finally {
  await sequelize.close();
}

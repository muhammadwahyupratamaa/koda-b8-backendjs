#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."

until nc -z "$DB_HOST" "$DB_PORT"
do
    sleep 1
done

echo "PostgreSQL is ready."

echo "Checking Sequelize migration state..."

node --input-type=module <<'EOF'
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

const [rows] = await sequelize.query(`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'schema_migrations'
  ) AS exists;
`);

const hasLegacyMigrations = rows[0].exists;

if (hasLegacyMigrations) {
  const [metaTables] = await sequelize.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'SequelizeMeta'
    ) AS exists;
  `);

  if (!metaTables[0].exists) {
    console.log("Existing database detected.");
    console.log("Creating SequelizeMeta baseline...");

    await sequelize.query(`
      CREATE TABLE "SequelizeMeta" (
        "name" VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY
      );
    `);

    await sequelize.query(`
      INSERT INTO "SequelizeMeta" ("name")
      VALUES
        ('20260816000001-create-users.js'),
        ('20260816000002-create-categories.js'),
        ('20260816000003-create-products.js'),
        ('20260816000004-create-wishlists.js'),
        ('20260816000005-create-carts.js'),
        ('20260816000006-create-cart-items.js'),
        ('20260816000007-create-orders.js'),
        ('20260816000011-seed-categories.js'),
        ('20260816000012-seed-products.js');
    `);

    console.log("Sequelize baseline created.");
  }
}

await sequelize.close();
EOF

echo "Running Sequelize migrations..."

npx sequelize-cli db:migrate

echo "Starting application..."

exec "$@"
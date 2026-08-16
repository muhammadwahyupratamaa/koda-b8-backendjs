export async function up(queryInterface) {
  await queryInterface.bulkInsert("products", [
    {
      id: 1,
      name: "Running Shoes",
      brand: "RunMax",
      category_id: null,
      price: 699000,
      price_disc: null,
      discount: 0,
      rating: 0.0,
      review: 0,
      sold: 0,
      stock: 42,
      is_featured: false,
      image_url: null,
      description: null,
      created_at: new Date("2026-08-05T16:35:48.662Z"),
      updated_at: new Date("2026-08-05T16:35:48.662Z"),
    },
  ]);

  await queryInterface.sequelize.query(`
    SELECT setval(
      pg_get_serial_sequence('"products"', 'id'),
      COALESCE((SELECT MAX(id) FROM "products"), 1),
      true
    );
  `);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("products", {
    id: 1,
  });
}

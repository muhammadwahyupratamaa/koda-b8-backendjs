export async function up(queryInterface) {
  await queryInterface.bulkInsert("categories", [
    {
      id: 1,
      name: "Elektronic",
      created_at: new Date("2026-08-05T16:35:48.721Z"),
      updated_at: new Date("2026-08-05T16:35:48.721Z"),
    },
    {
      id: 2,
      name: "Fashion",
      created_at: new Date("2026-08-05T16:35:48.721Z"),
      updated_at: new Date("2026-08-05T16:35:48.721Z"),
    },
    {
      id: 3,
      name: "Rumah & Dapur",
      created_at: new Date("2026-08-05T16:35:48.721Z"),
      updated_at: new Date("2026-08-05T16:35:48.721Z"),
    },
    {
      id: 4,
      name: "Kecantikan",
      created_at: new Date("2026-08-05T16:35:48.721Z"),
      updated_at: new Date("2026-08-05T16:35:48.721Z"),
    },
    {
      id: 5,
      name: "Olahraga",
      created_at: new Date("2026-08-05T16:35:48.721Z"),
      updated_at: new Date("2026-08-05T16:35:48.721Z"),
    },
    {
      id: 6,
      name: "Buku & Alat tulis",
      created_at: new Date("2026-08-05T16:35:48.721Z"),
      updated_at: new Date("2026-08-05T16:35:48.721Z"),
    },
  ]);

  await queryInterface.sequelize.query(`
    SELECT setval(
      pg_get_serial_sequence('"categories"', 'id'),
      COALESCE((SELECT MAX(id) FROM "categories"), 1),
      true
    );
  `);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("categories", {
    id: [1, 2, 3, 4, 5, 6],
  });
}

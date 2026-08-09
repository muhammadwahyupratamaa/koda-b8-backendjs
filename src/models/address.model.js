import pool from "../config/db.js";

async function getAll(userId) {
  const query = `
    SELECT *
    FROM addresses
    WHERE user_id = $1
    ORDER BY is_primary DESC, id DESC
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
}

async function getById(id, userId) {
  const query = `
    SELECT *
    FROM addresses
    WHERE id = $1
      AND user_id = $2
  `;

  const result = await pool.query(query, [id, userId]);

  return result.rows[0];
}

async function create(userId, data) {
  const {
    name,
    phone,
    address,
    city,
    province,
    postalCode,
    isPrimary,
  } = data;

  const query = `
    INSERT INTO addresses (
      user_id,
      name,
      phone,
      address,
      city,
      province,
      postal_code,
      is_primary
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const result = await pool.query(query, [
    userId,
    name,
    phone,
    address,
    city,
    province,
    postalCode,
    isPrimary,
  ]);

  return result.rows[0];
}

async function update(id, userId, data) {
  const {
    name,
    phone,
    address,
    city,
    province,
    postalCode,
  } = data;

  const query = `
    UPDATE addresses
    SET
      name = $1,
      phone = $2,
      address = $3,
      city = $4,
      province = $5,
      postal_code = $6,
      updated_at = NOW()
    WHERE id = $7
      AND user_id = $8
    RETURNING *
  `;

  const result = await pool.query(query, [
    name,
    phone,
    address,
    city,
    province,
    postalCode,
    id,
    userId,
  ]);

  return result.rows[0];
}

async function remove(id, userId) {
  const query = `
    DELETE FROM addresses
    WHERE id = $1
      AND user_id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [id, userId]);

  return result.rows[0];
}

async function setPrimary(id, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        UPDATE addresses
        SET is_primary = FALSE,
            updated_at = NOW()
        WHERE user_id = $1
      `,
      [userId],
    );

    const result = await client.query(
      `
        UPDATE addresses
        SET is_primary = TRUE,
            updated_at = NOW()
        WHERE id = $1
          AND user_id = $2
        RETURNING *
      `,
      [id, userId],
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  setPrimary,
};
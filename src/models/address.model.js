import sequelize from "../config/sequelize.js";
import Address from "./address.js";

async function getAll(userId) {
  return await Address.findAll({
    where: {
      user_id: userId,
    },
    order: [
      ["is_primary", "DESC"],
      ["id", "DESC"],
    ],
  });
}

async function getById(id, userId) {
  return await Address.findOne({
    where: {
      id,
      user_id: userId,
    },
  });
}

async function create(userId, data) {
  const { name, phone, address, city, province, postalCode, isPrimary } = data;

  return await Address.create({
    user_id: userId,
    name,
    phone,
    address,
    city,
    province,
    postal_code: postalCode,
    is_primary: isPrimary,
  });
}

async function update(id, userId, data) {
  const { name, phone, address, city, province, postalCode } = data;

  const addressData = await Address.findOne({
    where: {
      id,
      user_id: userId,
    },
  });

  if (!addressData) {
    return null;
  }

  addressData.name = name;
  addressData.phone = phone;
  addressData.address = address;
  addressData.city = city;
  addressData.province = province;
  addressData.postal_code = postalCode;

  await addressData.save();

  return addressData;
}

async function remove(id, userId) {
  const addressData = await Address.findOne({
    where: {
      id,
      user_id: userId,
    },
  });

  if (!addressData) {
    return null;
  }

  await addressData.destroy();

  return addressData;
}

async function setPrimary(id, userId) {
  const transaction = await sequelize.transaction();

  try {
    await Address.update(
      {
        is_primary: false,
      },
      {
        where: {
          user_id: userId,
        },
        transaction,
      },
    );

    const [affectedRows] = await Address.update(
      {
        is_primary: true,
      },
      {
        where: {
          id,
          user_id: userId,
        },
        transaction,
      },
    );

    if (affectedRows === 0) {
      await transaction.rollback();
      return null;
    }

    const addressData = await Address.findOne({
      where: {
        id,
        user_id: userId,
      },
      transaction,
    });

    await transaction.commit();

    return addressData;
  } catch (error) {
    await transaction.rollback();
    throw error;
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

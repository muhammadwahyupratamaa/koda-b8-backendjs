import User from "./user.js";

async function getProfile(userId) {
  return await User.findByPk(userId, {
    attributes: [
      "id",
      "name",
      "email",
      "phone",
      "birth_date",
      "gender",
      "avatar_url",
      "created_at",
    ],
  });
}

async function updateProfile(
  userId,
  name,
  email,
  phone,
  birthDate,
  gender,
  avatarUrl,
) {
  const user = await User.findByPk(userId);

  if (!user) {
    return null;
  }

  user.name = name;
  user.email = email;
  user.phone = phone;
  user.birth_date = birthDate;
  user.gender = gender;

  if (avatarUrl !== undefined) {
    user.avatar_url = avatarUrl;
  }

  await user.save();

  return user;
}

async function updatePassword(userId, password) {
  const user = await User.findByPk(userId);

  if (!user) {
    return null;
  }

  user.password = password;
  await user.save();

  return {
    id: user.id,
  };
}

async function getPassword(userId) {
  return await User.findByPk(userId, {
    attributes: ["password"],
  });
}

export default {
  getProfile,
  updateProfile,
  updatePassword,
  getPassword,
};
import User from "./user.js";

async function findByEmail(email) {
  return await User.findOne({
    where: {
      email,
    },
  });
}

async function create(name, email, password) {
  return await User.create({
    name,
    email,
    password,
  });
}

async function updatePassword(email, password) {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return null;
  }

  user.password = password;
  await user.save();

  return user;
}

export default {
  findByEmail,
  create,
  updatePassword,
};

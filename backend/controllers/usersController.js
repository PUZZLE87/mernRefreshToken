const User = require("./../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "کاربری پیدا نشد" });
  res.json(users);
};

module.exports = { getAllUsers };

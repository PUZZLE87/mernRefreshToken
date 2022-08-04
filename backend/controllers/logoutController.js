const User = require("../models/User");
const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookie?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  return res.sendStatus(204);
};

module.exports = { handleLogout };

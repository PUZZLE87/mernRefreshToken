const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const cookies = req.cookies;

  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "نام کاربری و پسورد نمی تواند خالی باشد" });

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.sendStatus(401);
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    return res.sendStatus(401);
  }

  const roles = Object.values(foundUser.roles).filter(Boolean);

  const accessToken = jwt.sign(
    {
      userInfo: { username: foundUser.username, roles },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" }
  );

  const newRefreshToken = jwt.sign(
    {
      username: foundUser.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  let newRefreshTokenArray = !cookies?.jwt
    ? foundUser.refreshToken
    : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

  if (cookies?.jwt) {
    const refreshToken = cookies.jwt;
    const foundToken = await User.findOne({ refreshToken }).exec();
    if (!foundToken) {
      newRefreshTokenArray = [];
    }

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  }

  foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  await foundUser.save();

  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.json({ roles, accessToken });
};

module.exports = { handleLogin };

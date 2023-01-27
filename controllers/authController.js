const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  res.status(StatusCodes.OK).json({ user });
};
const login = async (req, res) => {
  res.send("login");
};
const logout = async (req, res) => {
  res.send("logout");
};

module.exports = { register, login, logout };

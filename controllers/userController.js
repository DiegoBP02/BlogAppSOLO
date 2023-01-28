const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");

  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(StatusCodes.OK).json(user);
};
const updateUserPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const userId = req.user.userId;
  if (!newPassword || !oldPassword) {
    throw new BadRequestError("Please provide all values!");
  }

  const user = await User.findOne({ _id: userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials!");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Successful! Password updated!" });
};
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const { userId } = req.user;
  if (!name || !email) {
    throw new BadRequestError("Please provide all values!");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { name, email },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ msg: "Successful! User Updated!" });
};
const deleteUser = async (req, res) => {
  res.send("deleteUser");
};

module.exports = {
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};

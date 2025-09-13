const User = require("../models/users");
const { generateToken, verifyPassword, hashPassword } = require("../utils/authentication");
const { statusCodes } = require("../utils/errorConstants");

const loginUser = async (req) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw { statusCode: statusCodes.badRequest, message: "User doesn't exist" };
  }
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw { statusCode: statusCodes.badRequest, message: "Invalid password" };
  }
  const token = generateToken(user);
  return { token, user: { id: user._id, email: user.email, role: user.role } };
};

const registerUser = async (req) => {
  const { firstName, lastName, email, password, mobileNumber } = req.body;
  const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (existingUser) {
    throw { statusCode: statusCodes.badRequest, message: "User with this email or mobile number already exists" };
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({ firstName, lastName, email, mobileNumber, password: hashedPassword, role: "user" });
  const token = generateToken(newUser);
  return { token, user: { id: newUser._id, email: newUser.email, mobileNumber: newUser.mobileNumber, role: newUser.role } };
};

module.exports = { loginUser, registerUser };

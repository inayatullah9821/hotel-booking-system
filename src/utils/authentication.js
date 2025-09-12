const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (user) => {
  const token =  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d"
  });
  return `Bearer ${token}`;
};

const verifyPassword = async (inputPassword, storedHashedPassword) => {
  return await bcrypt.compare(inputPassword, storedHashedPassword);
};

const hashPassword = async (password) => {
  const saltRounds = process.env.SALT_ROUND || 10;
  return await bcrypt.hash(password, saltRounds);
};

module.exports = { generateToken, verifyPassword, hashPassword };
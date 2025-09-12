const userService = require("../services/authService");
const { statusCodes } = require("../utils/errorConstants");

const loginUser = async (req, res) => {
  try {
    const user = await userService.loginUser(req);
    res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(error.statusCode || 500).json({
      statusCode: error?.statusCode || statusCodes.internalServerError,
      message: this.statusCode != statusCodes ? error.message : "Internal Server Error"
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req);
    res.status(201).json({ message: "Registration successful", data: user });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(error.statusCode || 500).json({
      statusCode: error?.statusCode || statusCodes.internalServerError,
      message: this.statusCode != statusCodes ? error.message : "Internal Server Error"
    });
  }
};

module.exports = { loginUser, registerUser };

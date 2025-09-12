const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required()
});

const registerSchema = joi.object({
  firstName: joi.string().pattern(new RegExp("^[A-Za-z ]+$")).required(),
  lastName: joi.string().pattern(new RegExp("^[A-Za-z ]+$")).required(),
  email: joi.string().email().required(),
  mobileNumber: joi.string().required().min(10).max(10).label("Mobile number must be 10 digits"),
  password: joi.string().min(6).required()
});

module.exports = { loginSchema, registerSchema };
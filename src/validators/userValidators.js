const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&^#_\-]{8,}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
    })
});

const registerSchema = joi.object({
  firstName: joi.string().pattern(new RegExp("^[A-Za-z ]+$")).required(),
  lastName: joi.string().pattern(new RegExp("^[A-Za-z ]+$")).required(),
  email: joi.string().email().required(),
  mobileNumber: joi.string().required().min(10).max(10).label("Mobile number must be 10 digits"),
  password: joi
    .string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&^#_\-]{8,}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
    })
});

module.exports = { loginSchema, registerSchema };

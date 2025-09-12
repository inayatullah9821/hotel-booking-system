const router = require("express").Router();
const { validate } = require("../middlewares/validate");
const { loginUser, registerUser } = require("../controllers/authController");
const { loginSchema, registerSchema } = require("../validators/userValidators");

// Public routes
router.post("/login", validate(loginSchema), loginUser);
router.post("/register", validate(registerSchema), registerUser);

module.exports = router;
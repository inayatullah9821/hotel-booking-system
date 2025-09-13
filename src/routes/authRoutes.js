const router = require("express").Router();
const { validate } = require("../middlewares/validate");
const { loginUser, registerUser } = require("../controllers/authController");
const { loginSchema, registerSchema } = require("../validators/userValidators");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin User login
 *     description: Authenticate user with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *       400:
 *         description: Invalid password
 *       500:
 *         description: Internal Server Error
 */

router.post("/login", validate(loginSchema), loginUser);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user with first name, last name, email, mobile number, and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - mobileNumber
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *                 description: Only letters and spaces are allowed.
 *               lastName:
 *                 type: string
 *                 example: Doe
 *                 description: Only letters and spaces are allowed.
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testuser@schbang.com
 *               mobileNumber:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 10
 *                 example: "9876543210"
 *                 description: Must be exactly 10 digits.
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Test@1234
 *                 description: Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         mobileNumber:
 *                           type: string
 *                         role:
 *                           type: string
 *       400:
 *         description: User with this email or mobile number already exists / Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/register", validate(registerSchema), registerUser);

module.exports = router;

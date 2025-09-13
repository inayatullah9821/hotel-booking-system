const router = require("express").Router();
const { validate } = require("../middlewares/validate");
const { createHotel, getAllHotels, updateSpecialPrice, updateHotel, searchHotels } = require("../controllers/hotelController");
const { createHotelSchema, updateHotelSchema, specialPriceSchema, searchHotelSchema } = require("../validators/hotelValidators");
const { verifyToken, isAdmin } = require("../middlewares/authentication");

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               example: [72.8777, 19.0760]
 *         address:
 *           type: string
 *         roomsAvailable:
 *           type: integer
 *         defaultPricePerNight:
 *           type: number
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         createdBy:
 *           type: string
 *         modifiedBy:
 *           type: string
 */

/**
 * @swagger
 * /hotels/create:
 *   post:
 *     summary: Create a new hotel
 *     description: Add a new hotel with name, location coordinates, rooms available, default price, photos, and amenities.
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []   # if JWT auth is required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - coordinates
 *               - roomsAvailable
 *               - defaultPrice
 *               - photos
 *             properties:
 *               name:
 *                 type: string
 *                 example: Taj Hotel
 *               coordinates:
 *                 type: object
 *                 required:
 *                   - latitude
 *                   - longitude
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     format: double
 *                     example: 19.0760
 *                   longitude:
 *                     type: number
 *                     format: double
 *                     example: 72.8777
 *               address:
 *                 type: string
 *                 example: "Apollo Bunder, Colaba, Mumbai, India"
 *               roomsAvailable:
 *                 type: integer
 *                 example: 20
 *               defaultPrice:
 *                 type: number
 *                 example: 4500
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example:
 *                   - "https://example.com/photo1.jpg"
 *                   - "https://example.com/photo2.jpg"
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["WiFi", "Pool", "Gym"]
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hotel created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Hotel with this name already exists or invalid coordinates
 *       500:
 *         description: Internal server error
 */
router.post("/create", [verifyToken, isAdmin, validate(createHotelSchema)], createHotel);

router.get("/", [verifyToken, isAdmin], getAllHotels);

/**
 * @swagger
 * /hotels/{id}:
 *   put:
 *     summary: Update an existing hotel
 *     description: Update hotel details like name, coordinates, rooms available, default price per night, photos, and amenities.
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Taj Palace
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 19.0760
 *                   longitude:
 *                     type: number
 *                     example: 72.8777
 *               roomsAvailable:
 *                 type: integer
 *                 example: 30
 *               defaultPrice:
 *                 type: number
 *                 example: 5000
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example:
 *                   - "https://example.com/newphoto.jpg"
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["WiFi", "Spa", "Conference Hall"]
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hotel updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Invalid coordinates or bad request
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", [verifyToken, isAdmin, validate(updateHotelSchema)], updateHotel);

// special price update
router.post("/specialPrice/update", [verifyToken, isAdmin, validate(specialPriceSchema), updateSpecialPrice]);

/**
 * @swagger
 * /hotels/search:
 *   post:
 *     summary: Search hotels by location, availability, and dates
 *     description: Search for hotels within a given radius from coordinates, filter by name and available rooms, and calculate total and per-day prices including special prices.
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Optional hotel name filter (case-insensitive)
 *                 example: Holiday Inn
 *               latitude:
 *                 type: number
 *                 description: Latitude of search center
 *                 example: 19.0760
 *               longitude:
 *                 type: number
 *                 description: Longitude of search center
 *                 example: 72.8777
 *               radius:
 *                 type: number
 *                 description: Search radius in meters (default 5000)
 *                 example: 5000
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 description: Check-in date
 *                 example: 2025-09-10
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: Check-out date
 *                 example: 2025-09-12
 *               page:
 *                 type: integer
 *                 description: Page number for pagination (default 1)
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 description: Number of hotels per page (default 10)
 *                 example: 10
 *             required:
 *               - latitude
 *               - longitude
 *     responses:
 *       200:
 *         description: Hotels fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hotels fetched successfully
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalHotelsCount:
 *                   type: integer
 *                   example: 25
 *                 hotels:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       location:
 *                         type: object
 *                         properties:
 *                           coordinates:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [72.8777, 19.0760]
 *                       address:
 *                         type: string
 *                       roomsAvailable:
 *                         type: integer
 *                       defaultPricePerNight:
 *                         type: number
 *                       photos:
 *                         type: array
 *                         items:
 *                           type: string
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                       distance:
 *                         type: number
 *                         description: Distance from search coordinates in meters
 *                       priceByDates:
 *                         type: object
 *                         additionalProperties:
 *                           type: number
 *                           description: Price for that specific date (special price if exists, else default price)
 *       400:
 *         description: Bad request (invalid input)
 *       500:
 *         description: Internal server error
 */
router.post("/search", validate(searchHotelSchema), searchHotels);

module.exports = router;

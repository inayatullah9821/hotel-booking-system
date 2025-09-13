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
 *     tags: [Admin Routes]
 *     security:
 *       - bearerAuth: []
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


/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Get all hotels
 *     description: Fetches a paginated list of all hotels available in the system.
 *     tags:
 *       - Admin Routes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of hotels per page.
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalHotelsCount:
 *                       type: integer
 *                       example: 42
 *                     hotels:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64f92d83a5b6a93e2c1e1c4a"
 *                           name:
 *                             type: string
 *                             example: "Hotel Paradise"
 *                           address:
 *                             type: string
 *                             example: "123 Beach Road, Mumbai"
 *                           location:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                                 example: "Point"
 *                               coordinates:
 *                                 type: array
 *                                 items:
 *                                   type: number
 *                                 example: [72.8777, 19.0760]
 *                           roomsAvailable:
 *                             type: integer
 *                             example: 15
 *                           defaultPricePerNight:
 *                             type: number
 *                             example: 120.5
 *                           amenities:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["Free WiFi", "Pool", "Gym"]
 *                           photos:
 *                             type: array
 *                             items:
 *                               type: string
 *                               format: uri
 *                             example: ["https://example.com/hotel1.jpg"]
 *       500:
 *         description: Failed to fetch hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Failed to fetch hotels
 */
router.get("/", [verifyToken, isAdmin], getAllHotels);

/**
 * @swagger
 * /hotels/{id}:
 *   put:
 *     summary: Update an existing hotel
 *     description: Update hotel details like name, coordinates, rooms available, default price per night, photos, and amenities.
 *     tags: [Admin Routes]
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

/**
 * @swagger
 * /hotels/special-price:
 *   put:
 *     summary: Update or create a special price for a hotel
 *     description: >
 *       Updates or creates a special price for a hotel.  
 *       - Either date **OR** (startDate and endDate) must be provided.  
 *       - Special price must be greater than the hotel's default price per night.  
 *       - For a date range, each date within the range will have the same special price applied.
 *     tags:
 *       - Admin Routes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelId:
 *                 type: string
 *                 example: 64e59a8c1f23f93b91b45c11
 *               price:
 *                 type: number
 *                 example: 200
 *               specialPriceReason:
 *                 type: string
 *                 example: "Festival season hiked rates"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-20"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-20"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-25"
 *             required:
 *               - hotelId
 *               - price
 *               - specialPriceReason
 *             oneOf:
 *               - required: ["date"]
 *               - required: ["startDate", "endDate"]
 *     responses:
 *       200:
 *         description: Special price updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Special price updated successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid request (e.g., price less than default or invalid dates)
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/specialPrice/update", [verifyToken, isAdmin, validate(specialPriceSchema), updateSpecialPrice]);

/**
 * @swagger
 * /hotels/search:
 *   post:
 *     summary: Search hotels by location, availability, and dates
 *     description: Search for hotels within a given radius from coordinates, filter by name and get calculated price for requested stay.
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
 *                 description: Optional hotel name filter
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
 *                 description: check-in date
 *                 example: 2025-09-10
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: check-out date
 *                 example: 2025-09-12
 *               page:
 *                 type: integer
 *                 description: Page number for pagination
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 description: Number of hotels per page
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
 *                           description: each price breakdown by date
 *       400:
 *         description: Bad request (invalid input)
 *       500:
 *         description: Internal server error
 */
router.post("/search", validate(searchHotelSchema), searchHotels);

module.exports = router;

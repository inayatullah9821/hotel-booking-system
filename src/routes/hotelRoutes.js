const router = require("express").Router();
const { validate } = require("../middlewares/validate");
const { createHotel, getAllHotels, updateSpecialPrice, updateHotel, searchHotels } = require("../controllers/hotelController");
const { createHotelSchema, updateHotelSchema, specialPriceSchema, searchHotelSchema } = require("../validators/hotelValidators");
const { verifyToken, isAdmin } = require("../middlewares/authentication");

// Protected routes
router.post("/create", [verifyToken, isAdmin, validate(createHotelSchema)], createHotel);
router.get("/", [verifyToken, isAdmin], getAllHotels);
router.put("/:id", [verifyToken, isAdmin, validate(updateHotelSchema)], updateHotel);

// special price update
router.post("/specialPrice/update", [verifyToken, isAdmin, validate(specialPriceSchema), updateSpecialPrice]);
// hotel search
router.post("/search", validate(searchHotelSchema), searchHotels);

module.exports = router;

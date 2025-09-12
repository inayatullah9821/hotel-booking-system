const router = require("express").Router();
const { validate } = require("../middlewares/validate");
const {
  createHotel,
  getAllHotels,
  updateSpecialPrice,
  updateHotel,
  searchHotels,
} = require("../controllers/hotelController");
const { createHotelSchema, updateHotelSchema, specialPriceSchema, searchHotelSchema } = require("../validators/hotelValidators");
const { verifyToken } = require("../middlewares/authentication");

// Protected routes
router.post("/create", [verifyToken, validate(createHotelSchema)], createHotel);
router.get("/", verifyToken, getAllHotels);
router.put("/:id", verifyToken, validate(updateHotelSchema), updateHotel);

// special price update
router.post("/specialPrice/update", [verifyToken, validate(specialPriceSchema), updateSpecialPrice]);
// hotel search
router.post("/search", validate(searchHotelSchema), searchHotels);

module.exports = router;

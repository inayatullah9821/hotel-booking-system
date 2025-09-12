const router = require("express").Router();
const authRoutes = require("./authRoutes");
const hotelRoutes = require("./hotelRoutes");

router.use("/auth", authRoutes);
router.use("/hotels", hotelRoutes);

module.exports = router;

const joi = require("joi");

const createHotelSchema = joi.object({
  name: joi.string().min(3).max(100).required(),
  coordinates: joi
    .object({
      latitude: joi.number().min(-90).max(90).required(),
      longitude: joi.number().min(-180).max(180).required()
    })
    .required(),
  address: joi.string().max(200).optional(),
  roomsAvailable: joi.number().integer().min(0).required(),
  defaultPrice: joi.number().min(100).required(),
  photos: joi.array().items(joi.string().uri()).min(1),
  amenities: joi.array().items(joi.string().max(50)).optional()
});

const updateHotelSchema = joi
  .object({
    name: joi.string().min(3).max(100).optional(),
    coordinates: joi
      .object({
        latitude: joi.number().min(-90).max(90).required(),
        longitude: joi.number().min(-180).max(180).required()
      })
      .optional(),
    address: joi.string().max(200).optional(),
    roomsAvailable: joi.number().integer().min(0).optional(),
    defaultPrice: joi.number().min(100).optional(),
    photos: joi.array().items(joi.string().uri()).min(1).optional(),
    amenities: joi.array().items(joi.string().max(50)).optional()
  })
  .min(1);

const specialPriceSchema = joi
  .object({
    hotelId: joi.string().hex().length(24).required(),
    price: joi.number().min(0).required(),
    specialPriceReason: joi.string().max(200).required(),
    date: joi.date().min("now").label("Past date are not allowed"),
    startDate: joi.date().min("now").label("Past date are not allowed"),
    endDate: joi.date().min("now").label("Past date are not allowed")
  })
  .xor("date", "startDate")
  .with("startDate", "endDate")
  .with("endDate", "startDate");

const searchHotelSchema = joi
  .object({
    name: joi.string().min(1).max(100).optional(),
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required(),
    radius: joi.number().min(0).optional(), // in meters
    fromDate: joi.date().required(),
    toDate: joi.date().required(),
    page: joi.number().integer().min(1).optional(),
    limit: joi.number().integer().min(1).max(100).optional()
  })
  .custom((value, helpers) => {
    if (value.fromDate && value.toDate && value.fromDate > value.toDate) {
      return helpers.message('"fromDate" must be earlier than or equal to "toDate"');
    }
    return value;
  }, "Custom validation");

module.exports = { createHotelSchema, updateHotelSchema, specialPriceSchema, searchHotelSchema };

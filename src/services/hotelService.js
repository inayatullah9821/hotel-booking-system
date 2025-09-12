const Hotel = require("../models/hotels");
const SpecialPrice = require("../models/specialPrices");
const { normalizeDate } = require("../utils/date");
const { statusCodes } = require("../utils/errorConstants");
const { validateCoordinates } = require("../utils/geoCode");

const createHotel = async (req) => {
  try {
    const { name, coordinates, roomsAvailable, defaultPrice: defaultPricePerNight, photos, amenities } = req.body;
    const existingHotel = await Hotel.findOne({ name });
    if (existingHotel) {
      throw { statusCode: statusCodes.badRequest, message: "Hotel with this name already exists" };
    }
    const hotelData = {
      name,
      location: {
        coordinates: [coordinates.longitude, coordinates.latitude]
      },
      roomsAvailable,
      defaultPricePerNight,
      photos: photos || [],
      amenities: amenities || [],
      createdBy: req.user.id,
      modifiedBy: req.user.id
    };

    const geoData = await validateCoordinates({ lat: coordinates.latitude, long: coordinates.longitude });
    if (!geoData.valid) {
      throw { statusCode: statusCodes.badRequest, message: "Invalid coordinates provided" };
    }

    hotelData.address = geoData.address;
    const hotel = Hotel.create(hotelData);
    return hotel;
  } catch (error) {
    console.error("Error creating hotel:", error);
    throw error;
  }
};

const updateHotel = async (req) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, modifiedBy: req.user.id };

    if (updateData.coordinates) {
      const geoData = await validateCoordinates({ lat: updateData.coordinates.latitude, long: updateData.coordinates.longitude });
      if (!geoData.valid) {
        throw { statusCode: statusCodes.badRequest, message: "Invalid coordinates provided" };
      }
      updateData.address = geoData.address;
      updateData.location = {
        type: "Point",
        coordinates: [updateData.coordinates.longitude, updateData.coordinates.latitude]
      };
      delete updateData.coordinates;
    }

    const hotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true });
    if (!hotel) {
      throw { statusCode: statusCodes.notFound, message: "Hotel not found" };
    }
    return hotel;
  } catch (error) {
    console.error("Error updating hotel:", error);
    throw error;
  }
};

const getAllHotels = async (req) => {
  try {
    const hotels = await Hotel.find();
    return hotels;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw { statusCode: statusCodes.internalServerError, message: "Failed to fetch hotels" };
  }
};

const updateSpecialPrice = async (req) => {
  try {
    const { hotelId, date, startDate, endDate, price, specialPriceReason } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw { statusCode: statusCodes.notFound, message: "Hotel not found" };
    }
    if (price < hotel.defaultPricePerNight) {
      throw { statusCode: statusCodes.badRequest, message: "Special price must be greater than to default price" };
    }
    // if only date is provided, update or create for that date
    if (date) {
      const updateBody = { specialPricePerNight: price, specialPriceReason, modifiedBy: req.user.id };
      const newSpecialPriceEntry = {
        hotelId,
        createdBy: req.user.id
      };
      const specialPrice = await SpecialPrice.findOneAndUpdate(
        {
          hotelId,
          date
        },
        { $set: updateBody, $setOnInsert: newSpecialPriceEntry },
        { new: true, upsert: true }
      );
      return specialPrice;
    } else if (startDate && endDate) { // if range is provided, update or create for each date in range
      const start = normalizeDate(startDate);
      const end = normalizeDate(endDate);
      if (start > end) {
        throw { statusCode: statusCodes.badRequest, message: "Start date must be before end date" };
      }
      const currentDate = new Date(start);
      while(currentDate < end) {
        const updateBody = { specialPricePerNight: price, specialPriceReason, modifiedBy: req.user.id };
        const newSpecialPriceEntry = {
          hotelId,
          createdBy: req.user.id
        };
        await SpecialPrice.findOneAndUpdate(
          {
            hotelId,
            date: new Date(currentDate)
          },
          { $set: updateBody, $setOnInsert: newSpecialPriceEntry },
          { new: true, upsert: true }
        );
        currentDate.setDate(start.getDate() + 1);
        return true;
      }
    }
  } catch (error) {
    console.error("Error updating special price:", error);
    throw error;
  }
};

module.exports = { createHotel, updateHotel, getAllHotels, updateSpecialPrice };

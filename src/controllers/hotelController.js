const { statusCodes } = require("../utils/errorConstants");
const hotelService = require("../services/hotelService");

const createHotel = async (req, res) => {
  try {
    const hotel = await hotelService.createHotel(req);
    res.status(201).json({ message: "Hotel created successfully", data: hotel });
  } catch (error) {
    console.error("Error in createHotel:", error);
    res.status(error.statusCode || 500).json({
      statusCode: error?.statusCode || statusCodes.internalServerError,
      message: this.statusCode != statusCodes ? error.message : "Internal Server Error"
    });
  }
};

const updateHotel = async (req, res) => {
  try {
    const hotel = await hotelService.updateHotel(req);
    res.status(200).json({ message: "Hotel updated successfully", data: hotel });
  } catch (error) {
    console.error("Error in updateHotel:", error);
    res.status(error.statusCode || 500).json({
      statusCode: error?.statusCode || statusCodes.internalServerError,
      message: this.statusCode != statusCodes ? error.message : "Internal Server Error"
    });
  }
};

const getAllHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getAllHotels(req);
    res.status(200).json({ message: "Hotels fetched successfully", data: hotels });
  } catch (error) {
    console.error("Error in getAllHotels:", error);
    res.status(error.statusCode || 500).json({
      statusCode: error?.statusCode || statusCodes.internalServerError,
      message: this.statusCode != statusCodes ? error.message : "Internal Server Error"
    });
  }
};

const updateSpecialPrice = async (req, res) => {
  try {
    const hotel = await hotelService.updateSpecialPrice(req);
    res.status(200).json({ message: "Special price updated successfully", data: hotel });
  } catch (error) {
    console.error("Error in updateSpecialPrice:", error);
    res.status(error.statusCode || 500).json({
      statusCode: error?.statusCode || statusCodes.internalServerError,
      message: this.statusCode != statusCodes ? error.message : "Internal Server Error"
    });
  }
};

const searchHotels = async (req, res) => {
  try {
    const hotels = await hotelService.searchHotels(req);
    res.status(200).json({ message: "Hotels fetched successfully", data: hotels });
  } catch (error) {
    console.error("Error in searchHotels:", error);
    res.status(error.statusCode || 500).json({
      statusCode: error?.statusCode || statusCodes.internalServerError,
      message: this.statusCode != statusCodes ? error.message : "Internal Server Error"
    });
  }
};

module.exports = { createHotel, updateHotel, getAllHotels, updateSpecialPrice, searchHotels };

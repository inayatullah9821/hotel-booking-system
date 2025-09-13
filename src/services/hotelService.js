const { not } = require("joi");
const Hotel = require("../models/hotels");
const SpecialPrice = require("../models/specialPrices");
const { normalizeDate } = require("../utils/date");
const { statusCodes } = require("../utils/errorConstants");
const { validateCoordinates } = require("../utils/geoCode");

const createHotel = async (req) => {
  try {
    const { name, coordinates, roomsAvailable, defaultPrice: defaultPricePerNight, photos, amenities } = req.body;
    const existingHotel = await Hotel.findOne({
      name,
      "location.coordinates": [coordinates.longitude, coordinates.latitude]
    });
    if (existingHotel) {
      throw { statusCode: statusCodes.badRequest, message: "Hotel with same co ordinates already exists" };
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

    if (defaultPrice) {
      updateData.defaultPricePerNight = defaultPrice;
      delete updateData.defaultPrice;
    }

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

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Get all hotels
 *     description: Fetches a paginated list of all hotels available in the system.
 *     tags:
 *       - Hotels
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
const getAllHotels = async (req) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) {
      return { page, limit, totalHotelsCount: 0, hotels: [] };
    }
    const hotels = await Hotel.find().skip(skip).limit(limit);
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
    } else if (startDate && endDate) {
      // if range is provided, update or create for each date in range
      const start = normalizeDate(startDate);
      const end = normalizeDate(endDate);
      if (new Date(start) > new Date(end)) {
        throw { statusCode: statusCodes.badRequest, message: "Start date must be before end date" };
      }
      const currentDate = new Date(start);
      while (new Date(currentDate) <= new Date(end)) {
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
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  } catch (error) {
    console.error("Error updating special price:", error);
    throw error;
  }
};

const searchHotels = async (req) => {
  try {
    let { name, latitude, longitude, radius, fromDate, toDate, page, limit } = req.body;
    page = parseInt(req.query.page) || 1;
    limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!radius) radius = 5000; // default radius 5km
    const numberOfDays = fromDate && toDate ? Math.floor((normalizeDate(toDate) - normalizeDate(fromDate)) / (1000 * 60 * 60 * 24)) : 0;

    const totalHotelsCount = await Hotel.countDocuments({
      location: {
        $geoWithin: {
          $centerSphere: [[Number(longitude), Number(latitude)], radius / 6378137] // radius in radians
        }
      },
      ...(name ? { name: new RegExp(name, "i") } : {}),
      roomsAvailable: { $gt: 0 }
    });

    const hotels = await Hotel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
          distanceField: "distance",
          maxDistance: radius,
          spherical: true,
          query: {
            ...(name ? { name: new RegExp(name, "i") } : {})
          }
        }
      },
      {
        $match: { roomsAvailable: { $gt: 0 } }
      },
      {
        $project: {
          name: 1,
          location: 1,
          address: 1,
          roomsAvailable: 1,
          defaultPricePerNight: 1,
          photos: 1,
          amenities: 1,
          distance: 1
        }
      },
      {
        $lookup: {
          from: "specialprices",
          let: { hotelId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$hotelId", "$$hotelId"] }, { $gte: ["$date", new Date(normalizeDate(fromDate))] }, { $lt: ["$date", new Date(normalizeDate(toDate))] }]
                }
              }
            }
          ],
          as: "specialPrices"
        }
      },
      {
        $addFields: {
          specialPrices: { $ifNull: ["$specialPrices", []] },
          specialPricesSum: { $sum: "$specialPrices.specialPricePerNight" },
          specialPricesCount: { $size: "$specialPrices" }
        }
      },
      {
        $addFields: {
          totalPrice: {
            $cond: {
              if: { $eq: ["$specialPricesCount", numberOfDays] },
              then: "$specialPricesSum",
              else: {
                $add: ["$specialPricesSum", { $multiply: [{ $subtract: [numberOfDays, "$specialPricesCount"] }, "$defaultPricePerNight"] }]
              }
            }
          }
        }
      },
      { $sort: { distance: 1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    for (const hotel of hotels) {
      delete hotel.specialPricesSum;
      delete hotel.specialPricesCount;
      const priceByDates = {};
      for (i = 0; i < numberOfDays; i++) {
        let date = new Date(normalizeDate(fromDate));
        date.setDate(date.getDate() + i);
        const specialPrice = hotel.specialPrices.find((sp) => normalizeDate(sp.date).getTime() === date.getTime());
        const yyyyMMdd = new Intl.DateTimeFormat("en-CA").format(date);
        if (specialPrice) {
          priceByDates[yyyyMMdd] = specialPrice.specialPricePerNight;
        } else {
          priceByDates[yyyyMMdd] = hotel.defaultPricePerNight;
        }
      }
      delete hotel.specialPrices;
      hotel.priceByDates = priceByDates;
    }
    return { page, limit, totalHotelsCount, hotels };
  } catch (error) {
    console.error("Error searching hotels:", error);
    throw { statusCode: statusCodes.internalServerError, message: "Failed to search hotels" };
  }
};

module.exports = { createHotel, updateHotel, getAllHotels, updateSpecialPrice, searchHotels };

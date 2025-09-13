const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (val) {
            return (
              val.length === 2 &&
              val[0] >= -180 &&
              val[0] <= 180 && // long
              val[1] >= -90 &&
              val[1] <= 90 // lat
            ); 
          },
          message: "Invalid coordinates format"
        }
      }
    },
    address: { type: String },
    roomsAvailable: { type: Number, required: true, default: 0 },
    defaultPricePerNight: { type: Number, required: true },
    photos: [String], // array of URLs or file paths
    amenities: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
  },
  { timestamps: true }
);

// Create geospatial index for location queries
hotelSchema.index({ location: "2dsphere" });
hotelSchema.index({ "location.coordinates": 1 }, { unique: true });

module.exports = mongoose.model("Hotel", hotelSchema);

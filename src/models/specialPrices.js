const mongoose = require("mongoose");

const specialPriceSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    specialPricePerNight: { type: Number, required: true },
    specialPriceReason: { type: String, required: true },
    date: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

specialPriceSchema.index({ hotel: 1, date: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("SpecialPrice", specialPriceSchema);

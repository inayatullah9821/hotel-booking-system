const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, match: /^[A-Za-z ]+$/ },
    lastName: { type: String, required: true, match: /^[A-Za-z ]+$/ },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

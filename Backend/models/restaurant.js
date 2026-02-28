const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  rating: Number
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: {
      type: String,
      enum: [
        "Pizza",
        "Burgers",
        "Desserts",
        "Coffee",
        "Salads",
        "Cakes",
        "Asian",
        "Italian"
      ],
      required: true
    },
    image: String,
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
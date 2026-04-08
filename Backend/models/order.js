const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: Number,
    paymentMethod: {
  type: String,
  enum: ["COD", "ONLINE"],
  default: "COD"
},
paymentStatus: {
  type: String,
  enum: ["Pending", "Paid", "Failed"],
  default: "Pending"
},razorpayOrderId: String,
    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveryLocation: {
  lat: Number,
  lng: Number,
  updatedAt: Date
},
    orderStatus: {
      type: String,
      enum: ["Pending", "Preparing", "Out for Delivery", "Delivered","Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },
  isAvailable: Boolean
}, { timestamps: true });

module.exports = mongoose.model("order", foodSchema);

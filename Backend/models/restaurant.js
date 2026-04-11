const restaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  rating: Number,

  latitude: Number,
  longitude: Number,

  avgDeliveryTime: Number, // minutes
  deliveryFee: Number

}, { timestamps: true });
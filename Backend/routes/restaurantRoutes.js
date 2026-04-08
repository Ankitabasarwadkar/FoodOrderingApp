const express = require("express");
const Restaurant = require("../models/Restaurant");
const Food = require("../models/food");
const result = require("../utils/result");

const router = express.Router();

// 🔥 GET ALL RESTAURANTS
// router.get("/", async (req, res) => {
//   try {
//     const restaurants = await Restaurant.find();
//     return res.send(result.createResult(null, restaurants));
//   } catch (err) {
//     return res.send(result.createResult(err.message));
//   }
// });

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    const restaurantsWithImage = await Promise.all(
      restaurants.map(async (restaurant) => {
        const food = await Food.findOne({
          restaurantId: restaurant._id,
        });

        return {
          ...restaurant._doc,
          image: food ? food.image : null,
        };
      })
    );

    return res.send(result.createResult(null, restaurantsWithImage));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});
// 🔥 GET SINGLE RESTAURANT
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.send(result.createResult("Restaurant not found"));
    }

    return res.send(result.createResult(null, restaurant));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// 🔥 ADD RESTAURANT (ADMIN)
router.post("/", async (req, res) => {
  try {
    const { name, location, rating } = req.body;

    if (!name || !location) {
      return res.send(result.createResult("Required fields missing"));
    }

    const newRestaurant = new Restaurant({
      name,
      location,
      rating,
      ownerId: req.user._id,
    });

    const savedRestaurant = await newRestaurant.save();

    return res.send(
      result.createResult(null, {
        message: "Restaurant added successfully",
        restaurant: savedRestaurant,
      })
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// 🔥 UPDATE RESTAURANT
router.put("/:id", async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.send(result.createResult("Restaurant not found"));
    }

    return res.send(
      result.createResult(null, {
        message: "Restaurant updated",
        restaurant: updatedRestaurant,
      })
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// 🔥 DELETE RESTAURANT
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.send(result.createResult("Restaurant not found"));
    }

    return res.send(
      result.createResult(null, "Restaurant deleted successfully")
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

module.exports = router;
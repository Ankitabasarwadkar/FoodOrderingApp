const express = require("express");
const Food = require("../models/food");
const upload = require("../middleware/upload");
const result = require("../utils/result");

const router = express.Router();

// ADD FOOD
router.post("/:restaurantId", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const { restaurantId } = req.params;

    const newFood = new Food({
      name,
      description,
      price,
      category,
      restaurantId,
      image: req.file ? req.file.filename : null,
    });

    const savedFood = await newFood.save();

    return res.send(result.createResult(null, savedFood));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});


// GET FOODS BY RESTAURANT
router.get("/:restaurantId", async (req, res) => {
  try {
    const foods = await Food.find({
      restaurantId: req.params.restaurantId,
    });

    return res.send(result.createResult(null, foods));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// UPDATE FOOD
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const updateData = {
      name,
      description,
      price,
      category
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Food.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.send(result.createResult(null, updated));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// DELETE FOOD
router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    return res.send(result.createResult(null, "Food deleted"));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

module.exports = router;
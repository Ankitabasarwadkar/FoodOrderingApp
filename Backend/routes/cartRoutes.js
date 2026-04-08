const express = require("express");
const Cart = require("../models/cart");
const Food=require("../models/food");
const result = require("../utils/result");

const router = express.Router();


// ADD TO CART
router.post("/add/:foodId", async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const { foodId } = req.params;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.send(result.createResult("Food not found"));
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
        totalAmount: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.foodId.toString() === foodId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        foodId,
        quantity,
        price: food.price, // ✅ FIX
      });
    }

    // recalc total
    cart.totalAmount = 0;
    cart.items.forEach((item) => {
      cart.totalAmount += item.price * item.quantity;
    });

    await cart.save();

    return res.send(result.createResult(null, cart));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});


// GET CART
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate("items.foodId");

    return res.send(result.createResult(null, cart));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});


// UPDATE QUANTITY
router.put("/update/:foodId", async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    const item = cart.items.find(
      (item) => item.foodId.toString() === req.params.foodId
    );

    if (item) {
      item.quantity = quantity;
    }

    // recalc total
    cart.totalAmount = 0;
    cart.items.forEach((item) => {
      cart.totalAmount += item.price * item.quantity;
    });

    await cart.save();

    return res.send(result.createResult(null, cart));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});


// REMOVE ITEM
router.delete("/:foodId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    cart.items = cart.items.filter(
      (item) => item.foodId.toString() !== req.params.foodId
    );

    // recalc total
    cart.totalAmount = 0;
    cart.items.forEach((item) => {
      cart.totalAmount += item.price * item.quantity;
    });

    await cart.save();

    return res.send(result.createResult(null, cart));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});


// CLEAR CART
router.delete("/clear/all", async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalAmount: 0 }
    );

    return res.send(result.createResult(null, "Cart cleared"));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

module.exports = router;
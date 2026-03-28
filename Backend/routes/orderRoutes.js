const express = require("express");
const Order = require("../models/order");
const result = require("../utils/result");

const router = express.Router();

//placing order
router.post("/", async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    if (!restaurantId || !items || !totalAmount) {
      return res.send(result.createResult("Required fields missing"));
    }

    const newOrder = new Order({
      userId: req.user._id,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Placed",
    });

    const savedOrder = await newOrder.save();

    return res.send(
      result.createResult(null, {
        message: "Order placed successfully",
        order: savedOrder,
      })
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

//get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("restaurantId");

    return res.send(result.createResult(null, orders));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// 🔥 GET USER ORDERS
router.get("/my-orders", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });

    return res.send(result.createResult(null, orders));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// 🔥 GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId")
      .populate("restaurantId");

    if (!order) {
      return res.send(result.createResult("Order not found"));
    }

    return res.send(result.createResult(null, order));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// 🔥 UPDATE ORDER STATUS
router.put("/:id/status", async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.send(result.createResult("Status is required"));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.send(result.createResult("Order not found"));
    }

    return res.send(
      result.createResult(null, {
        message: "Order status updated",
        order: updatedOrder,
      })
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// 🔥 ASSIGN DELIVERY PARTNER
router.put("/:id/assign", async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;

    if (!deliveryPartnerId) {
      return res.send(result.createResult("Delivery partner ID required"));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryPartnerId },
      { new: true }
    );

    if (!updatedOrder) {
      return res.send(result.createResult("Order not found"));
    }

    return res.send(
      result.createResult(null, {
        message: "Delivery partner assigned",
        order: updatedOrder,
      })
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

module.exports = router;
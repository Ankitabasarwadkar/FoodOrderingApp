const express = require("express");
const Order = require("../models/order");
const Food=require("../models/food")
const Cart=require("../models/cart");
   main
const result = require("../utils/result");

const router = express.Router();



const crypto = require("crypto");

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.send("Payment verification failed");
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    order.paymentStatus = "Paid";
    order.orderStatus = "Preparing";

    await order.save();

    res.send({
      message: "Payment successful",
      order,
    });

  } catch (err) {
    res.send(err.message);
  }
});
//placing order
// router.post("/place", async (req, res) => {
//   try {
//     const {
//       restaurantId,
//       items,
//       totalAmount,
//       deliveryAddress,
//       paymentMethod,
//     } = req.body;

//     if (!restaurantId || !items || !totalAmount) {
//       return res.send(result.createResult("Required fields missing"));
//     }

//     const newOrder = new Order({
//       userId: req.user._id,
//       restaurantId,
//       items,
//       totalAmount,
//       deliveryAddress,
//       paymentMethod,
//       paymentStatus: "Pending",
//       orderStatus: "Pending",
//     });

//     const savedOrder = await newOrder.save();
// const io = req.app.get("io");
//     io.emit("new-order", savedOrder);
//     return res.send(
//       result.createResult(null, {
//         message: "Order placed successfully",
//         order: savedOrder,
//       })
//     );
//   } catch (err) {
//     return res.send(result.createResult(err.message));
//   }
// });



router.post("/place", async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.send(result.createResult("Cart is empty"));
    }

    let totalAmount = 0;
    let finalItems = [];

    for (let item of cart.items) {
      const food = await Food.findById(item.foodId);

      totalAmount += food.price * item.quantity;

      finalItems.push({
        foodId: item.foodId,
        quantity: item.quantity,
        price: food.price,
      });
    }

    const order = new Order({
      userId: req.user._id,
      items: finalItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    const savedOrder = await order.save();

    // COD case
    if (paymentMethod === "COD") {
      return res.send({
        message: "Order placed with COD",
        order: savedOrder,
      });
    }

    // ONLINE case
    const razorpay = require("../utils/payment");

    const payment = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: savedOrder._id.toString(),
    });

    savedOrder.razorpayOrderId = payment.id;
    await savedOrder.save();

    res.send({
      payment,
      order: savedOrder,
    });

  } catch (err) {
    res.send(result.createResult(err.message));
  }
});
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
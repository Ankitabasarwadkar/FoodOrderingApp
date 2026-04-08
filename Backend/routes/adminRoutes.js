
const express = require("express");
const cryptojs = require("crypto-js");
const User = require("../models/users");
const Order = require("../models/order");
const result = require("../utils/result");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const router = express.Router();

router.post("/add-delivery", async (req, res) => {
  try {
    const { name, email, password, mobileNo } = req.body;

    // 1️⃣ Check admin
    // if (req.user.role !== "admin") {
    //   return res.send(result.createResult("Only admin can add delivery boy"));
    // }

    // 2️⃣ Check required fields
    if (!name || !email || !password) {
      return res.send(result.createResult("All required fields missing"));
    }

    // 3️⃣ Check if user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.send(
        result.createResult("User already exists with this email")
      );
    }

    // 4️⃣ Hash password
    const hashedPassword = cryptojs.SHA256(password).toString();

    // 5️⃣ Create delivery user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobileNo,
      role: "delivery", // important
    });

    // 6️⃣ Save user
    const savedUser = await newUser.save();

    // 7️⃣ Send response
    return res.send(
      result.createResult(null, {
        message: "Delivery boy added successfully",
        userId: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      })
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});
router.put("/assign-delivery/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.send(result.createResult("Order not found"));
    }

    // find any delivery boy
    const deliveryBoy = await User.findOne({ role: "delivery" });

    if (!deliveryBoy) {
      return res.send(result.createResult("No delivery boy available"));
    }

    order.deliveryPartnerId = deliveryBoy._id;
    order.orderStatus = "Out for Delivery";

    await order.save();
order.deliveryPartnerId = deliveryBoy._id;
order.orderStatus = "Out for Delivery";

await order.save();

const io = req.app.get("io");

io.to(order._id.toString()).emit("status-update", {
  status: order.orderStatus,
});
    return res.send(
      result.createResult(null, "Delivery assigned automatically")
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

router.put("/:id/accept", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.send(result.createResult("Admin only"));
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.send(result.createResult("Order not found"));
    }

    order.orderStatus = "Preparing";
    await order.save();
    const io = req.app.get("io");

io.to(order._id.toString()).emit("status-update", {
  status: order.orderStatus,
});

    return res.send(result.createResult(null, "Order accepted & preparing"));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

router.put("/convert-admin-password", async (req, res) => {
  try {
    const cryptojs = require("crypto-js");

    const user = await User.findOne({ email: "admin@gmail.com" });

    if (!user) {
      return res.send(result.createResult("Admin not found"));
    }

    // convert plain to hash
    const hashedPassword = cryptojs.SHA256(user.password).toString();

    user.password = hashedPassword;
    await user.save();

    return res.send(
      result.createResult(null, "Admin password converted to hash")
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

router.get("/unassigned", async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartnerId: null,
    });

    return res.send(result.createResult(null, orders));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});
router.get("/admin/assigned", async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartnerId: { $ne: null },
    });

    return res.send(result.createResult(null, orders));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

router.put("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return res.send(result.createResult("Order not found"));
    }

    order.orderStatus = "Cancelled";
    await order.save();
    const io = req.app.get("io");

io.to(order._id.toString()).emit("status-update", {
  status: order.orderStatus,
});

    return res.send(result.createResult(null, order));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});


router.get("/delivery-boys", async (req, res) => {
  try {
    const deliveryBoys = await User.find({ role: "delivery" });

    return res.send(result.createResult(null, deliveryBoys));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});
router.delete("/delivery/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    return res.send(result.createResult(null, "Delivery deleted"));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// router.put("/:id/cancel", async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       _id: req.params.id,
//       userId: req.user._id,
//       deliveryPartnerId: null,
//     });

//     if (!order) {
//       return res.send(result.createResult("Cannot cancel this order"));
//     }

//     order.orderStatus = "Cancelled";
//     await order.save();

//     return res.send(result.createResult(null, order));
//   } catch (err) {
//     return res.send(result.createResult(err.message));
//   }
// });
module.exports = router;
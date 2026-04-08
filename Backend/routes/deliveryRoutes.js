const express = require("express");
const Order = require("../models/order");
const User=require("../models/users")
const result = require("../utils/result");

const router = express.Router();

// GET ASSIGNED ORDERS
router.get("/my-orders", async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartnerId: req.user._id,
    });

    return res.send(result.createResult(null, orders));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});
// UPDATE DELIVERY STATUS
// router.put("/:id/status", async (req, res) => {
//   try {
//     const { orderStatus } = req.body;

//     // check delivery role
//     if (req.user.role !== "delivery") {
//       return res.send(result.createResult("Only delivery partner allowed"));
//     }

//     // validate status
//     const validStatus = [
//       "Pending",
//       "Preparing",
//       "Out for Delivery",
//       "Delivered",
//     ];

//     if (!validStatus.includes(orderStatus)) {
//       return res.send(result.createResult("Invalid status value"));
//     }

//     const order = await Order.findOne({
//       _id: req.params.id,
//       deliveryPartnerId: req.user._id,
//     });

//     if (!order) {
//       return res.send(result.createResult("Order not assigned to you"));
//     }

//     order.orderStatus = orderStatus;
//     await order.save();

//     return res.send(
//       result.createResult(null, {
//         message: "Status updated successfully",
//         orderId: order._id,
//         orderStatus: order.orderStatus,
//       })
//     );
//   } catch (err) {
//     return res.send(result.createResult(err.message));
//   }
// });

router.put("/:id/out-for-delivery", async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryPartnerId: req.user._id,
    });

    if (!order) {
      return res.send(result.createResult("Order not assigned to you"));
    }

    order.orderStatus = "Out for Delivery";
    await order.save();
    const io = req.app.get("io");

io.to(order._id.toString()).emit("status-update", {
  status: order.orderStatus,
});
    return res.send(result.createResult(null, "Order picked up"));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

router.put("/:id/delivered", async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryPartnerId: req.user._id,
    });

    if (!order) {
      return res.send(result.createResult("Order not assigned to you"));
    }

    order.orderStatus = "Delivered";
    await order.save();
        const io = req.app.get("io");

io.to(order._id.toString()).emit("status-update", {
  status: order.orderStatus,
});
    return res.send(result.createResult(null, "Order delivered"));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

// router.get("/delivery/my-orders", async (req, res) => {
//   try {
//     const orders = await Order.find({
//       deliveryPartnerId: req.user._id,
//     });

//     return res.send(result.createResult(null, orders));
//   } catch (err) {
//     return res.send(result.createResult(err.message));
//   }
// });

router.put("/location/:orderId", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const order = await Order.findById(req.params.orderId);

    order.deliveryLocation = {
  lat,
  lng,
  updatedAt: new Date()
};
    await order.save();

    // 🔥 real-time emit
    const io = req.app.get("io");

    io.to(req.params.orderId).emit("location-update", {
      lat,
      lng,
    });

    return res.send(result.createResult(null, "Location updated"));
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});
module.exports = router;
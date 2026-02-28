const express = require("express");
const cryptojs = require("crypto-js");
const User = require("../models/users");
const result = require("../utils/result");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const router = express.Router();


router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check required fields
    if (!email || !password) {
      return res.send(result.createResult("Email and password required"));
    }

    // 2️⃣ Check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.send(result.createResult("User does not exist"));
    }

    // 3️⃣ Hash entered password
    const hashedPassword = cryptojs.SHA256(password).toString();

    // 4️⃣ Compare password
    if (hashedPassword !== user.password) {
      return res.send(result.createResult("Invalid password"));
    }

    // 5️⃣ Create JWT Token
    const token = jwt.sign(
      {
        email: user.email,
        mobileNo: user.mobileNo,
        role: user.role,
      },
      config.SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Send response
    return res.send(
      result.createResult(null, {
        message: "Login successful",
        token: token,
        // name: user.name,
        // role: user.role,
      })
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});


router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, mobileNo } = req.body;

    // 1️⃣ Check required fields
    if (!name || !email || !password) {
      return res.send(result.createResult("All required fields missing"));
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.send(
        result.createResult("User already exists with this email")
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = cryptojs.SHA256(password).toString();

    // 4️⃣ Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobileNo,
    });

    // 5️⃣ Save user
    const savedUser = await newUser.save();

    // 6️⃣ Send success response
    return res.send(
      result.createResult(null, {
        message: "User registered successfully",
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





router.get("/my-profile", async (req, res) => {
  try {
    const email = req.user.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.send(result.createResult("User not found"));
    }

    return res.send(
      result.createResult(null, {
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        role: user.role,
      }
        
      )
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});


// CHANGE PASSWORD
router.put("/change-password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const email = req.user.email;

    if (!oldPassword || !newPassword) {
      return res.send(result.createResult("All fields are required"));
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.send(result.createResult("User not found"));
    }

    // Hash old password
    const hashedOldPassword = cryptojs.SHA256(oldPassword).toString();

    // Check old password
    if (hashedOldPassword !== user.password) {
      return res.send(result.createResult("Old password is incorrect"));
    }

    // Hash new password
    const hashedNewPassword = cryptojs.SHA256(newPassword).toString();

    // Update password
    user.password = hashedNewPassword;

    await user.save();

    return res.send(
      result.createResult(null, "Password changed successfully")
    );
  } catch (err) {
    return res.send(result.createResult(err.message));
  }
});

module.exports = router;
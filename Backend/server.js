require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");



const cors = require("cors");
const { authUser } = require("./utils/auth");
const connectDB = require("./db/db");
const userRoutes = require("./routes/userRoutes");
const restRoutes = require("./routes/restaurantRoutes");
const orderRoutes=require("./routes/orderRoutes")

const app = express();
mongoose.connect(process.env.MONGO_URI);
console.log(process.env.MONGO_URI);

connectDB(); //  database connection here

app.use(cors());
app.use(express.json());
app.use(authUser);

// routes
app.use("/users", userRoutes);
app.use("/rest", restRoutes);
app.use("/orders",orderRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
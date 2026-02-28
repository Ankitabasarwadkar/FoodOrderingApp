const express = require("express");
const cors = require("cors");
const { authUser } = require("./utils/auth");
const connectDB = require("./db/db");
const userRoutes = require("./routes/userRoutes");
const app = express();

connectDB(); //  database connection here

app.use(cors());
app.use(express.json());
app.use(authUser);

// routes
app.use("/users", userRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
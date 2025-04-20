const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./Routes/productRoutes.js");
const cartRoutes = require("./Routes/cartRoutes.js");
const orderRoutes = require("./Routes/orderRoutes.js");
const connectDB = require("./config/db.js");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("api/products", productRoutes);
app.use("api/cart", cartRoutes);
app.use("api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

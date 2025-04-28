const express = require("express");

const { getCart, addToCart } = require("../Controllers/cartController.js");
const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);

module.exports = router;

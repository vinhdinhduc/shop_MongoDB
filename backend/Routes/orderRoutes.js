const express = require("express");
const { createOrder, getOrder } = require("../Controllers/orderController.js");
const router = express.Router();

router.post("/", createOrder);
router.get("/:id", getOrder);

module.exports = router;

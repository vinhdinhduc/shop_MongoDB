const express = require("express");

const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../Controllers/cartController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/:userId", authMiddleware, getCart);
router.post("/", authMiddleware, addToCart);
router.delete("/:userId/:productId", authMiddleware, removeFromCart);
router.delete("/:userId", authMiddleware, clearCart);
module.exports = router;

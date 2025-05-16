const Cart = require("../Models/cartModel");
const mongoose = require("mongoose");

const getCart = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    // Log để debug
    console.log("Attempting to find cart for userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    console.log("Cart found:", cart);

    if (!cart) {
      console.log("No cart found, returning empty cart");
      return res.status(200).json({ userId, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  console.log("check addToCart", productId, quantity);

  try {
    const userId = req.user._id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Product ID không hợp lệ" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );
    res.status(201).json(updatedCart);
  } catch (err) {
    console.error("Lỗi khi thêm vào giỏ hàng:", err.message);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;
  let cart = await Cart.findOne({ userId });
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  await cart.save();
  res.json(cart);
};

// xóa all
const clearCart = async (req, res) => {
  const { userId } = req.params;
  await Cart.findOneAndUpdate({ userId }, { items: [] });
  res.json({ items: [] });
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

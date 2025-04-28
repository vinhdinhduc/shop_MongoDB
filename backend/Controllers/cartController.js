const Cart = require("../models/cartModel");

//Lấy giỏ hàng
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne(req.params.id).populate("items.productId");
    res.status(200).json(cart || { userId: req.params.id, items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Thêm sp vào giỏ hàng

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId == productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getCart,
  addToCart,
};

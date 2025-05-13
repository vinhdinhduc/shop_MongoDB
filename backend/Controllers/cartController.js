const Cart = require("../Models/cartModel");

const getCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.status(200).json(cart || { userId, items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  console.log("Dữ liệu nhận được:", req.body);
  console.log("Thông tin user từ token:", req.user);

  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error.message);
    res.status(500).json({ message: "Lỗi server", error: error.message });
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

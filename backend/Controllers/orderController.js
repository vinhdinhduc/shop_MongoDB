const Order = require("../Models/orderModel");
const Product = require("../Models/productModel");
const User = require("../Models/userModel");

//Tạo đơn hàng
const createOrder = async (req, res) => {
  try {
    // Validate dữ liệu
    const { userId, products, totalAmount } = req.body;

    if (!userId || !products || products.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.title} không đủ hàng.`,
        });
      }
    }

    // Tạo đơn hàng
    const order = new Order({
      user: userId,
      orderItems: products.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.productId.pricing,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: totalAmount,
      voucherCode: req.body.voucherCode,
    });
    for (const item of order.orderItems) {
      await Order.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      errorDetails: error.stack,
    });
  }
};

//Lấy đơn hàng

const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createOrder,
  getOrder,
};

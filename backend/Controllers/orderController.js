const Order = require("../Models/orderModel");

//Tạo đơn hàng
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const created = await order.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

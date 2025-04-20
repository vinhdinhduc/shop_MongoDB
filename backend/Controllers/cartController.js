const Cart = require("../Models/cartModel");

const getCart = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
module.exports = {};

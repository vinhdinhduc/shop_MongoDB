const Product = require("../Models/productModel");

//Lấy  tất cả sp
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};
//Lấy sp theo id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};
// Thêm sp
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};

//Cập nhật sp
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};
module.exports = {
  getProducts: getProducts,
  createProduct: createProduct,
  getProductById: getProductById,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
};

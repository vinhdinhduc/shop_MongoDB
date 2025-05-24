const Category = require("../models/categoryModel");

// Lấy danh sách tất cả danh mục
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách danh mục",
      error: error.message,
    });
  }
};

// Lấy thông tin một danh mục theo ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh mục", error: error.message });
  }
};

// Thêm danh mục mới
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json({
      message: "Danh mục đã được tạo thành công",
      category: newCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo danh mục", error: error.message });
  }
};

// Cập nhật danh mục
const updateCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    res.status(200).json({ message: "Danh mục đã được cập nhật", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật danh mục", error: error.message });
  }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    await category.remove();
    res.status(200).json({ message: "Danh mục đã được xóa" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa danh mục", error: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

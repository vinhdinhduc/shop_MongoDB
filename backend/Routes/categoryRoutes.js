const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categoryController");
const { authMiddleware } = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Lấy danh sách tất cả danh mục
router.get("/", getCategories);

// Lấy thông tin một danh mục theo ID
router.get("/:id", getCategoryById);

// Thêm danh mục mới (chỉ admin)
router.post("/", authMiddleware, createCategory);

// Cập nhật danh mục (chỉ admin)
router.put("/:id", authMiddleware, updateCategory);

// Xóa danh mục (chỉ admin)
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;

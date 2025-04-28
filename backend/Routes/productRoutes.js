const express = require("express");
const {
  getProducts,
  getTrash,
  createProduct,
  updateProduct,
  upload,
  restore,
  deleteProduct,
  deleteForce,
  deleteMulti,
  getProductById,
  emptyTrash,
} = require("../Controllers/productController.js");
const router = express.Router();
router.put("/soft-delete-multiple", deleteMulti);
router.get("/trash", getTrash);
router.put("/restore/:id", restore);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload, createProduct);
router.put("/:id", upload, updateProduct);
router.delete("/:id", deleteProduct);
router.delete("/force-delete/:id", deleteForce);
router.delete("/trash/empty", emptyTrash);

module.exports = router;

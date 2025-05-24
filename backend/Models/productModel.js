const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    manufacture_details: {
      //tt sản xuất
      model_number: String, // mã sản phẩm
      release_date: Date, // ngày phát hành
    },
    shipping_details: {
      // thông tin vận chuyển
      weight: Number,
      width: Number,
      height: Number,
      depth: Number,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    pricing: {
      type: Number,
      required: true,
    },
    images: [String],
    videos: [String],
    category: String, // danh mục sản phẩm
    brand: String, // thương hiệu
    attributes: [
      {
        color: String,
        size: String,
        stock: Number, // số lượng tồn kho
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.index({
  title: "text",
  category: "text",
  brand: "text",
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

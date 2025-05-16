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
      model_number: String,
      release_date: Date,
    },
    shipping_details: {
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
    category: String,
    brand: String,
    attributes: [
      {
        color: String,
        size: String,
        stock: Number,
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

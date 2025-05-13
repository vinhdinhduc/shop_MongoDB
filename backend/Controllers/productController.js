const Product = require("../Models/productModel");
const multer = require("multer");
const path = require("path");

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Thư mục lưu trữ file
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Bộ lọc file (chỉ chấp nhận ảnh và video)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh và video"), false);
  }
};

// Middleware multer
const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "images", maxCount: 5 }, // Xử lý tối đa 5 file cho trường "images"
  { name: "videos", maxCount: 2 }, // Xử lý tối đa 2 file cho trường "videos"
]);

// Lấy tất cả sản phẩm
const getProducts = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, color, size, sort } =
      req.query;

    // Xây dựng bộ lọc
    let query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }
    if (minPrice || maxPrice) {
      query.pricing = {};
      if (minPrice) query.pricing.$gte = Number(minPrice);
      if (maxPrice) query.pricing.$lte = Number(maxPrice);
    }
    if (color || size) {
      query.attributes = {
        $elemMatch: {
          ...(color && { color }),
          ...(size && { size }),
        },
      };
    }

    // Xử lý sắp xếp
    let sortOption = {};
    if (sort === "priceAsc") {
      sortOption = { pricing: 1 }; // Giá tăng dần
    } else if (sort === "priceDesc") {
      sortOption = { pricing: -1 }; // Giá giảm dần
    } else {
      sortOption = { createdAt: -1 }; // Mặc định: sản phẩm mới nhất
    }

    // Lấy sản phẩm từ MongoDB
    const products = await Product.find(query).sort(sortOption);

    // Trả về dữ liệu
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error.message);
    res.status(500).json({
      message: "Lỗi server khi lấy sản phẩm",
      error: error.message,
    });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(400).json({ message: error.message });
  }
};

// Thêm sản phẩm
const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Files:", req.files);

    const images = req.files.images
      ? req.files.images.map((file) => `/uploads/${file.filename}`)
      : [];
    const videos = req.files.videos
      ? req.files.videos.map((file) => `/uploads/${file.filename}`)
      : [];

    let attributes = [];
    if (req.body.attributes) {
      try {
        attributes = JSON.parse(req.body.attributes);
      } catch (parseError) {
        return res
          .status(400)
          .json({ message: "Dữ liệu attributes không hợp lệ" });
      }
    }

    const productData = {
      ...req.body,
      images,
      videos,
      attributes,
    };

    console.log("Product data:", productData);
    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error.stack);
    if (error.code === 11000) {
      res.status(400).json({ message: "SKU đã tồn tại" });
    } else {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Files:", req.files);

    const images = req.files.images
      ? req.files.images.map((file) => `/uploads/${file.filename}`)
      : req.body.images || [];
    const videos = req.files.videos
      ? req.files.videos.map((file) => `/uploads/${file.filename}`)
      : req.body.videos || [];

    let attributes = [];
    if (req.body.attributes) {
      try {
        attributes = JSON.parse(req.body.attributes);
      } catch (parseError) {
        return res
          .status(400)
          .json({ message: "Dữ liệu attributes không hợp lệ" });
      }
    }

    const productData = {
      ...req.body,
      images,
      videos,
      attributes,
    };

    console.log("Product data:", productData);
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true }
    );
    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.stack);
    if (error.code === 11000) {
      res.status(400).json({ message: "SKU đã tồn tại" });
    } else {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({ message: "Sản phẩm đã được chuyển vào thùng rác" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error.message);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// Xóa mềm nhiều sản phẩm
const deleteMulti = async (req, res) => {
  try {
    const { ids } = req.body;
    await Product.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true, deletedAt: new Date() } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Khôi phục sản phẩm
const restore = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      $set: { deleted: false, deletedAt: null },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa vĩnh viễn
const deleteForce = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy sản phẩm trong thùng rác
const getTrash = async (req, res) => {
  try {
    const products = await Product.find({ deleted: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const emptyTrash = async (req, res) => {
  try {
    await Product.deleteMany({ deleted: true }); // Giả sử bạn có trường `deleted` để đánh dấu sản phẩm đã xóa
    res.status(200).json({ message: "Thùng rác đã được dọn sạch" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi dọn sạch thùng rác", error: error.message });
  }
};

module.exports = {
  getTrash,
  emptyTrash,
  restore,
  deleteMulti,
  deleteForce,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  upload,
};

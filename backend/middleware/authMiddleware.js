const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

const isCustomer = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "customer") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { isAdmin, isCustomer, authMiddleware };

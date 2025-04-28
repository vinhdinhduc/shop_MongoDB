const express = require("express");
const { registerAdmin } = require("../Controllers/authController");
const router = express.Router();

router.post("/register-admin", registerAdmin);

module.exports = router;

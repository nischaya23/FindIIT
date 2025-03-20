const express = require("express");
const { createProduct, deleteProduct, getProducts, getProductById } = require("../controllers/productController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("uploadedImage"), createProduct);
router.get("/", authMiddleware, getProducts);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/:id", authMiddleware, getProductById);

module.exports = router;

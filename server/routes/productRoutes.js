const express = require("express");
const { createProduct, deleteProduct, getProducts, getProductById, getProductsByUploader, addClaimRequest, handleClaimRequest } = require("../controllers/productController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("uploadedImage"), createProduct);
router.get("/", authMiddleware, getProducts);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/:id", authMiddleware, getProductById);
router.get("/user/:id", authMiddleware, getProductsByUploader);

router.post("/:id/claim", authMiddleware, addClaimRequest);
router.put("/:id/claim/:claimId/:status", authMiddleware, handleClaimRequest);

module.exports = router;

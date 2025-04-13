const express = require("express");
const { createProduct, deleteProduct, getProducts, getProductById, getProductsByUploader, addClaimRequest, handleClaimRequest } = require("../controllers/productController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
});

router.post("/", authMiddleware, (req, res, next) => {
    upload.single("uploadedImage")(req, res, function (err) {
        if (err) {
            if (err.message === "Only image files are allowed!") {
                return res.status(400).json({ success: false, message: err.message });
            }
            return res.status(500).json({ success: false, message: "Upload error" });
        }
        next();
    });
}, createProduct);
router.get("/", authMiddleware, getProducts);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/:id", authMiddleware, getProductById);
router.get("/user/:id", authMiddleware, getProductsByUploader);

router.post("/:id/claim", authMiddleware, addClaimRequest);
router.put("/:id/claim/:claimId/:status", authMiddleware, handleClaimRequest);

module.exports = router;

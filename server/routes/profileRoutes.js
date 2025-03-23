const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/profile", authMiddleware, getProfile);
router.post("/profile", authMiddleware, upload.single("profilePicture"), updateProfile);

module.exports = router;

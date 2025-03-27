const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const User = require("../models/User"); // Import the User model

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/profile/:id", authMiddleware, getProfile);
router.post("/profile", authMiddleware, upload.single("profilePicture"), updateProfile);
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("name email");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/email/:email", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select("_id name");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user by email:", error);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;
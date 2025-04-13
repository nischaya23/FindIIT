const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const multer = require("multer");
const User = require("../models/User"); // Import the User model

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

router.get("/profile/:id", authMiddleware, getProfile);
router.post("/profile", authMiddleware, (req, res, next) => {
    upload.single("profilePicture")(req, res, function (err) {
        if (err) {
            if (err.message === "Only image files are allowed!") {
                return res.status(400).json({ success: false, message: err.message });
            }
            return res.status(500).json({ success: false, message: "Upload error" });
        }
        next();
    });
}, updateProfile);

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

router.put("/profile/ban/:id", adminAuthMiddleware, async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: "Cannot make changes to yourself" });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isBanned) {
            return res.status(400).json({ message: "User is already banned" });
        }
        user.isBanned = true;
        await user.save();
        res.status(200).json({ message: "User banned successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/profile/unban/:id", adminAuthMiddleware, async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: "Cannot make changes to yourself" });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.isBanned) {
            return res.status(400).json({ message: "User is not banned" });
        }
        user.isBanned = false;
        await user.save();
        res.status(200).json({ message: "User unbanned successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/profile/admin/:id", adminAuthMiddleware, async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: "Cannot make changes to yourself" });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isAdmin) {
            return res.status(400).json({ message: "User is already admin" });
        }
        user.isAdmin = true;
        await user.save();
        res.status(200).json({ message: "User made admin successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/profile/unadmin/:id", adminAuthMiddleware, async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: "Cannot make changes to yourself" });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.isAdmin) {
            return res.status(400).json({ message: "User is already not admin" });
        }
        user.isAdmin = false;
        await user.save();
        res.status(200).json({ message: "User removed from admins successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
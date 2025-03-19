const express = require("express");
const { signup, verifyOTP, login, forgot, verifyOTPreset } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/forgot", forgot);
router.post("/verify-otp-reset", verifyOTPreset);
router.post("/login", login);

module.exports = router;

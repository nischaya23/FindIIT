const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    if (!email.endsWith('@iitk.ac.in')) {
        return res.status(400).json({ message: "Invalid email. Use iitk mail id" });
    }
    try {
        let user = await User.findOne({ email });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = Date.now() + 300000;

        if (user) {
            if (user.isVerified) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (user.otpExpires > Date.now()) {
                user.password = hashedPassword;
                return res.status(201).json({ message: "Previous OTP still valid" });
            } else {
                user.password = hashedPassword;
                user.otp = otp;
                user.otpExpires = otpExpires;
            }
        } else {
            user = new User({ email, password: hashedPassword, otp, otpExpires, verified: false });
        }

        await user.save();

        // Send OTP
        await transporter.sendMail({
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}`,
        });

        res.status(201).json({ message: "OTP sent to email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing up" });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Invalid OTP or expired" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "Signup successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP" });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.isVerified) return res.status(400).json({ message: "Invalid email or password" });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json({ message: "Invalid email or password" });

        const tokenPayload = { id: user._id, email: user.email || "missing@email.com" };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};

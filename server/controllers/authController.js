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

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    if (!email.endsWith('@iitk.ac.in')) {
        return res.status(400).json({ message: "Invalid email. Use iitk mail id" });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number and one special character" });
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
                await user.save();
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

        return res.status(201).json({ message: "OTP sent to email" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error signing up" });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            const userWithExpiredOtp = await User.findOne({ email, otp, otpExpires: { $lt: Date.now() } });
            if (userWithExpiredOtp) {
                return res.status(400).json({ message: "OTP has expired" });
            } else {
                return res.status(400).json({ message: "Invalid OTP" });
            }
        }
        if (user.isVerified) return res.json({ message: "Email already verified" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return res.json({ message: "Signup successful" });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP" });
    }
};

// Forgot
exports.forgot = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.isVerified) return res.status(400).json({ message: "User not found" });

        if (user.otpExpires !== undefined && user.otpExpires > Date.now()) {
            return res.status(201).json({ message: "Previous OTP still valid" });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 300000;

        await user.save();

        // Send OTP
        await transporter.sendMail({
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code to reset password is ${otp}`,
        });

        return res.status(201).json({ message: "OTP sent to email" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error verifying OTP" });
    }
};

// Verify OTP
exports.verifyOTPreset = async (req, res) => {
    const { email, otp, password } = req.body;
    try {
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number and one special character" });
        }
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            const userWithExpiredOtp = await User.findOne({ email, otp, otpExpires: { $lt: Date.now() } });
            if (userWithExpiredOtp) {
                return res.status(400).json({ message: "OTP has expired" });
            } else {
                return res.status(400).json({ message: "Invalid OTP" });
            }
        }
        if (!user.isVerified) return res.status(400).json({ message: "Email does not exists" });
        user.password = await bcrypt.hash(password, 10);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return res.json({ message: "Reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP" });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.isVerified) return res.status(400).json({ message: "Invalid email or password" });

        if (user.isBanned) return res.status(400).json({ message: "Account is banned" });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json({ message: "Invalid email or password" });

        const tokenPayload = { id: user._id, email: user.email, isAdmin: user.isAdmin || "missing@email.com" };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Error logging in" });
    }
};

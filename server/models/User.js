const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },

    name: { type: String },
    phone: { type: String },
    department: { type: String },
    designation: { type: String },
    profilePicture: { type: String, default: "" },

});

module.exports = mongoose.model("User", userSchema);

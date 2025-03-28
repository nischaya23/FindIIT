// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config(); // Ensure this is at the top

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected");
//     } catch (error) {
//         console.error("MongoDB connection failed", error);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
};

module.exports = connectDB; // ✅ CommonJS export


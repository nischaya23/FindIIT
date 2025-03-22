const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderId: { type: String, required: true },
        roomId: { type: String, required: true, index: true },
        message: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

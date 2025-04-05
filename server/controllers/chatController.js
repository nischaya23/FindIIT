const Message = require("../models/Message");
const User=require("../models/User")
const mongoose = require("mongoose");

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id; // Securely extracted from token
        const { receiverId, message } = req.body;

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();

        // Emit message using the unique room ID
        const io = req.app.get("socketio");
        const roomId = [senderId, receiverId].sort().join("_"); // Ensure same room for both users
        io.to(roomId).emit("receiveMessage", newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Message send error:", error);
        res.status(500).json({ error: "Message send failed" });
    }
};

// Retrieve chat history
exports.getMessages = async (req, res) => {
    try {
        user1 = req.user.id;
        const { user2 } = req.params;
        if (!user1 || !user2) {
            return res.status(400).json({ error: "Both user IDs are required" });
        }

        // Ensure IDs are ObjectIds
        const messages = await Message.find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Could not retrieve messages" });
    }
};


exports.getPreviousChats = async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID from middleware

        // Find distinct chat partners where user is sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        }).sort({ createdAt: -1 });

        // Extract unique user IDs
        const chatUserIds = new Set();
        messages.forEach((msg) => {
            if (msg.senderId.toString() !== userId) chatUserIds.add(msg.senderId.toString());
            if (msg.receiverId.toString() !== userId) chatUserIds.add(msg.receiverId.toString());
        });

        // Fetch chat partners' details
        const chatUsers = await User.find({ _id: { $in: [...chatUserIds] } }).select("name email");

        res.json(chatUsers);
    } catch (error) {
        console.error("Error fetching previous chats:", error);
        res.status(500).json({ message: "Server error" });
    }
};
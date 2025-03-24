const Message = require("../models/Message");
const mongoose = require("mongoose");

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

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
        const { user1, user2 } = req.params;

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

const Message = require("../models/Message");

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, roomId, message } = req.body;

        if (!senderId || !roomId || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newMessage = new Message({ senderId, roomId, message });
        await newMessage.save();

        // Emit message only once
        const io = req.app.get("socketio");
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
        const { roomId } = req.params;

        if (!roomId) {
            return res.status(400).json({ error: "Room ID is required" });
        }

        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

        if (!messages.length) {
            return res.status(404).json({ error: "No messages found for this room" });
        }

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

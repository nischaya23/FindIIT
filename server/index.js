require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");


const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");


// Initialize Express app
const app = express();
const httpServer = createServer(app); // Corrected

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Attach socket.io to app
app.set("socketio", io);

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/chat", chatRoutes);



// Socket.io Logic
io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("joinRoom", ({ senderId, receiverId }) => {
        const roomId = [senderId, receiverId].sort().join("_"); // Unique room for two users
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("sendMessage", (msgData) => {
        const { senderId, receiverId, message } = msgData;

        if (!senderId || !receiverId || !message.trim()) {
            console.error("Invalid message data:", msgData);
            return;
        }

        const roomId = [senderId, receiverId].sort().join("_");
        io.to(roomId).emit("receiveMessage", msgData);
        console.log(`Message sent in room ${roomId}:`, msgData);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

}

// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

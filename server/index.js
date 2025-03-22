require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path"); 
const { Server } = require("socket.io");
const { createServer } = require("http");

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
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/user", require("./routes/profileRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Socket.io Logic
io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on("sendMessage", (msgData) => {
        io.to(msgData.roomId).emit("receiveMessage", msgData);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

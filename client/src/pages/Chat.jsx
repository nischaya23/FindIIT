import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getMessages, sendMessage } from "../api/chat";
import "./Chat.css";

const socket = io("http://localhost:5000", { autoConnect: false });

const Chat = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const userId = localStorage.getItem("userId") || "test-user";

    useEffect(() => {
        socket.connect();
        socket.emit("joinRoom", roomId);

        const fetchMessages = async () => {
            try {
                const res = await getMessages(roomId);
                setMessages(res);
            } catch (error) {
                console.error("Error fetching messages", error);
            }
        };
        fetchMessages();

        const handleReceiveMessage = (data) => {
            setMessages((prev) => [...prev, data]);
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.disconnect();
        };
    }, [roomId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const msgData = { senderId: userId, roomId, message };

        try {
            await sendMessage(msgData);
            setMessage("");
        } catch (error) {
            console.error("Message send failed", error);
        }
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h2>FINDIIT</h2>
                <nav>
                    <a href="/">Home</a>
                    <a href="/items">My Items</a>
                    <a href="/map">Map</a>
                    <a href="/profile">Profile</a>
                </nav>
            </header>

            <div className="chat-box">
                <div className="chat-header-info">
                    <img src="https://via.placeholder.com/40" alt="Profile" className="profile-pic" />
                    <div>
                        <strong>NEED TO SORT THIS:John Doe</strong>
                        {/* <p className="status">Online</p> */}
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-bubble ${msg.senderId === userId ? "sent" : "received"}`}>
                            <p>{msg.message}</p>
                            <span className="timestamp">10:30 AM</span>
                        </div>
                    ))}
                </div>

                <form className="chat-input" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit">
                        <img src="https://img.icons8.com/ios-filled/50/000000/telegram-app.png" alt="Send" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;

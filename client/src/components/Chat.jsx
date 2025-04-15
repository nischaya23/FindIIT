// default landing page of chats in now ./chats
// this page is in ChatPage.jsx
// treat this page as a component only

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { getMessages, sendMessage } from "../api/chat";
import { getID } from "../api/auth";
import axios from "axios";
import "./Chat.css";
import EmojiPicker from 'emoji-picker-react';
import { useRef } from 'react';


const socket = io(`${import.meta.env.VITE_API_URL}`, { autoConnect: false });

const Chat = ({ chatId }) => {
    const senderId = getID();
    const receiverId = chatId;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [receiverName, setReceiverName] = useState("User");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef(null);


    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
        };
    useEffect(() => {
        if (!senderId || !receiverId) {
            console.error("Missing senderId or receiverId");
            return;
        }

        const roomId = [senderId, receiverId].sort().join("_");
        socket.connect();
        socket.emit("joinRoom", { senderId, receiverId });

        const fetchMessages = async () => {
            try {
                const res = await getMessages(senderId, receiverId);
                setMessages(res);
            } catch (error) {
                console.error("Error fetching messages", error);
            }
        };
        fetchMessages();

        const fetchReceiverName = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${receiverId}`);
                setReceiverName(res.data.name || res.data.email || "Unknown User");
            } catch (error) {
                console.error("Error fetching receiver name:", error);
            }
        };
        fetchReceiverName();

        // Ensure no duplicate listeners
        socket.off("receiveMessage");

        socket.on("receiveMessage", (data) => {
            setMessages((prev) => {
                if (!prev.find((msg) => msg._id === data._id)) {
                    return [...prev, data]; // Prevent duplicate messages in state
                }
                return prev;
            });
        });

        return () => {
            socket.off("receiveMessage");
            socket.disconnect();
        };
    }, [receiverId]); // Re-run when receiverId changes

    const handleSend = async (e) => {
        e.preventDefault();
        if (!senderId || !receiverId || !message.trim()) return;

        try {
            const savedMessage = await sendMessage(senderId, receiverId, message);
            const newMessage = { ...savedMessage, roomId: [senderId, receiverId].sort().join("_") };

            if (socket.connected) {
                socket.emit("sendMessage", newMessage);
            }

            setMessages((prev) => {
                if (!prev.find((msg) => msg._id === savedMessage._id)) {
                    return [...prev, savedMessage];
                }
                return prev;
            });

            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year}  ${hours}:${minutes}`;
      };
      
    return (
        <div className="chat-box">
            <div className="chat-header-info">
                <Link to={`/profile/${receiverId}`} style={{ textDecoration: "none", color: "inherit" }}> <strong>{receiverName}</strong> </Link>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.senderId === senderId ? "sent" : "received"}`}>
                        <p>{msg.message}</p>
                        <span className="timestamp">{formatTimestamp(msg.createdAt)}</span>
                    </div>
                ))}
            </div>

            {showEmojiPicker && (
        <div className="emoji-picker-wrapper">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <form className="chat-input-form" onSubmit={handleSend}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          style={{ background: "none", border: "none", cursor: "pointer", marginRight: "8px" }}
        >
          😊
        </button>

        <input
          ref={inputRef}
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
    );
};

export default Chat;

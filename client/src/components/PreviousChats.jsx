// default landing page of chats in now ./chats
// this page is in ChatPage.jsx
// treat this page as a component only

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PreviousChats.css";
import Navbar from "./NavBar";

const PreviousChats = ({ onSelectChat }) => {
    const [chats, setChats] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found, user might not be logged in.");
                    return;
                }

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/previous-chats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setChats(res.data);
            } catch (error) {
                console.error("Error fetching previous chats:", error);
            }
        };

        fetchChats();
    }, []);
// Function to start a new chat using email
    const handleStartChat = async () => {
        setError("");
        if (!searchEmail.trim()) {
            setError("Please enter a valid email.");
            return;
        }

        try {
            // Get user details using email
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/email/${searchEmail}`);

            if (res.data && res.data._id) {
                onSelectChat(res.data._id);
                // navigate(`/chat/${res.data._id}`); // Redirect to chat page
            } else {
                setError("User not found.");
            }
        } catch (error) {
            setError("User not found.");
            console.error("Error finding user:", error);
        }
    };

    return (
        <>
            {/* <Navbar /> */}
            <div className="previous-chats-container">
                <h2>Previous Chats</h2>
                <br></br>
                <div className="new-chat-section">
                    <input
                        type="email"
                        placeholder="Enter User Email to start chat"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="chat-input"
                    />
                    <button onClick={handleStartChat} className="start-chat-btn">Start Chat</button>
                    {error && <p className="error-message">{error}</p>}
                </div>

                {chats.length === 0 ? (
                    <p>No previous chats found.</p>
                ) : (
                    <ul className="chat-list">
                        {chats.map((chat) => (
                            <li key={chat._id} onClick={() => onSelectChat(chat._id)} className="chat-item">
                                {chat.name ? chat.name : chat.email}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default PreviousChats;

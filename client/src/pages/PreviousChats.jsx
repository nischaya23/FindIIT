import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PreviousChats.css";

const PreviousChats = () => {
    const [chats, setChats] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found, user might not be logged in.");
                    return;
                }

                const res = await axios.get("http://localhost:5000/api/chat/previous-chats", {
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
            const res = await axios.get(`http://localhost:5000/api/user/email/${searchEmail}`);

            if (res.data && res.data._id) {
                navigate(`/chat/${res.data._id}`); // Redirect to chat page
            } else {
                setError("User not found.");
            }
        } catch (error) {
            setError("User not found.");
            console.error("Error finding user:", error);
        }
    };

    return (
        <div className="previous-chats-container">
            <h2>Previous Chats</h2>

            {/* New Chat Section */}
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

            {/* Previous Chats */}
            {chats.length === 0 ? (
                <p>No previous chats found.</p>
            ) : (
                <ul className="chat-list">
                    {chats.map((chat) => (
                        <li key={chat._id}>
                            <Link to={`/chat/${chat._id}`}>{chat.name}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        
    );
};

export default PreviousChats;

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PreviousChats from "../components/PreviousChats";
import Chat from "../components/Chat";
import "./ChatPage.css";
import Navbar from "../components/NavBar";

const ChatPage = () => {
    const { id } = useParams();
    const [selectedChatId, setSelectedChatId] = useState(id || null);

    return (
        <div className="whole-chat-page">
            <Navbar />
            <div className="chat-page">
                {/* Left side - Previous Chats */}
                <div className="previous-chats">
                    <PreviousChats onSelectChat={(chatId) => setSelectedChatId(chatId)} />
                </div>

                {/* Right side - Chat Window */}
                <div className="chat-window">
                    {selectedChatId ? <Chat chatId={selectedChatId} /> : (
                        <div className="chat-placeholder">
                            <img src="https://img.icons8.com/ios-filled/100/000000/chat-message.png" alt="Chat Icon" />
                            <h3>Select a conversation to start messaging</h3>
                            <p>Click on a user from the list to begin your chat.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

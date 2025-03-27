import React, { useState } from "react";
import PreviousChats from "../components/PreviousChats";
import Chat from "../components/Chat";
import "./ChatPage.css";
import Navbar from "../components/NavBar";

const ChatPage = () => {
    const [selectedChatId, setSelectedChatId] = useState(null);

    return (
        <div>
            <Navbar />
            <div className="chat-page">
                {/* Left side - Previous Chats */}
                <div className="previous-chats">
                    <PreviousChats onSelectChat={(chatId) => setSelectedChatId(chatId)} />
                </div>

                {/* Right side - Chat Window */}
                <div className="chat-window">
                    {selectedChatId ? <Chat chatId={selectedChatId} /> : <p>Select a chat to start messaging</p>}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

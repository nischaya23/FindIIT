// default landing page of chats in now ./chats
// this page is in ChatPage.jsx
// treat this page as a component only

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { getMessages, sendMessage } from "../api/chat";
import { getID } from "../api/auth";
import axios from "axios";
import "./Chat.css";

const socket = io("http://localhost:5000", { autoConnect: false });

const Chat = ({ chatId }) => {
    const senderId = getID();
    const receiverId = chatId;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [receiverName, setReceiverName] = useState("User");

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
                const res = await axios.get(`http://localhost:5000/api/user/${receiverId}`);
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

    return (
        <div className="chat-box">
            <div className="chat-header-info">
                <strong>{receiverName}</strong>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-bubble ${msg.senderId === senderId ? "sent" : "received"}`}>
                        <p>{msg.message}</p>
                        <span className="timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>

            <form className="chat-input-form" onSubmit={handleSend}>
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
    );
};

export default Chat;


// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import { getMessages, sendMessage } from "../api/chat";
// import { getID } from "../api/auth";
// import axios from "axios";
// import "./Chat.css";
// import { Link, useNavigate } from "react-router-dom";
// import Navbar from "../components/NavBar";

// const socket = io("http://localhost:5000", { autoConnect: false });

// const Chat = () => {
//     const { id: receiverId } = useParams();
//     const senderId = getID();
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const [receiverName, setReceiverName] = useState("User");
//     const navigate=useNavigate()

//     useEffect(() => {
//         if (!senderId || !receiverId) {
//             console.error("Missing senderId or receiverId");
//             return;
//         }
    
//         const roomId = [senderId, receiverId].sort().join("_");
//         socket.connect();
//         socket.emit("joinRoom", { senderId, receiverId });
    
//         const fetchMessages = async () => {
//             try {
//                 const res = await getMessages(senderId, receiverId);
//                 setMessages(res);
//             } catch (error) {
//                 console.error("Error fetching messages", error);
//             }
//         };
//         fetchMessages();
//         const fetchReceiverName = async () => {
//             try {
//                 const res = await axios.get(`http://localhost:5000/api/user/${receiverId}`);
//                 setReceiverName(res.data.name || "Unknown User");
//             } catch (error) {
//                 console.error("Error fetching receiver name:", error);
//             }
//         };
//         fetchReceiverName();

    
//         // Remove previous listener before adding a new one
//         socket.off("receiveMessage"); // This ensures no duplicate listeners
    
//         socket.on("receiveMessage", (data) => {
//             setMessages((prev) => {
//                 if (!prev.find((msg) => msg._id === data._id)) {
//                     return [...prev, data]; // Prevent duplicate messages in state
//                 }
//                 return prev;
//             });
//         });
    
//         return () => {
//             socket.off("receiveMessage"); // Cleanup when component unmounts
//             socket.disconnect();
//         };
//     }, [receiverId]); // Re-run only when receiverId changes

//     const handleSend = async (e) => {
//         e.preventDefault();
//         if (!senderId || !receiverId || !message.trim()) return;
    
//         try {
//             const savedMessage = await sendMessage(senderId, receiverId, message);
//             const newMessage = { ...savedMessage, roomId: [senderId, receiverId].sort().join("_") };
    
//             // Emit message through socket (ensuring it's sent only once)
//             if (socket.connected) {
//                 socket.emit("sendMessage", newMessage);
//             }
    
//             // Prevent duplicate state updates
//             setMessages((prev) => {
//                 if (!prev.find((msg) => msg._id === savedMessage._id)) {
//                     return [...prev, savedMessage];
//                 }
//                 return prev;
//             });
    
//             setMessage(""); // Clear input after sending
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };
    

//     return (
//         <div className="chat-container">
//             {/* <header className="chat-header">
//                 <h2>FINDIIT</h2>
//                 <nav>
//                     <a href="/">Home</a>
//                     <a href="/items">My Items</a>
//                     <a href="/map">Map</a>
//                     <a href="/profile">Profile</a>
//                 </nav>
//             </header> */}
//             <Navbar />
//             <div className="chat-box">
//                 <div className="chat-header-info">
//                     {/* <img src="./" alt="Profile" className="profile-pic" /> */}
//                     <div>
//                         <strong>{receiverName}</strong>
//                     </div>
//                 </div>
//                 <button className="back-button" onClick={() => navigate("/previous-chats")}>
//                     ⬅️ Back to Previous Chats
//                 </button>

//                 <div className="chat-messages">
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`chat-bubble ${msg.senderId === senderId ? "sent" : "received"}`}>
//                             <p>{msg.message}</p>
//                             <span className="timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</span>
//                         </div>
//                     ))}
//                 </div>

//                 <form className="chat-input" onSubmit={handleSend}>
//                     <input
//                         type="text"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         placeholder="Type a message..."
//                     />
//                     <button type="submit">
//                         <img src="https://img.icons8.com/ios-filled/50/000000/telegram-app.png" alt="Send" />
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Chat;

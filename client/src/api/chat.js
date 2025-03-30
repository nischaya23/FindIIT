import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/chat`;

export const sendMessage = async (senderId, receiverId, message) => {
    try {
        console.log("API Request Payload:", { senderId, receiverId, message }); // Debugging
        const response = await axios.post(`${API_URL}/send`, { senderId, receiverId, message });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        throw error;
    }
};

export const getMessages = async (senderId, receiverId) => {
    try {
        const response = await axios.get(`${API_URL}/${senderId}/${receiverId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error.message);
        throw error;
    }
};

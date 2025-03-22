import axios from "axios";

const API_URL = "http://localhost:5000/api/chat";

export const sendMessage = async (msgData) => {
    try {
        console.log("API Request Payload:", msgData); // Debugging
        const response = await axios.post(`${API_URL}/send`, msgData);
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        throw error;
    }
};

export const getMessages = async (roomId) => {
    try {
        const response = await axios.get(`${API_URL}/${roomId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error.message);
        throw error;
    }
};

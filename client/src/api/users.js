import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/user`;

export const getProfile = async (id) => {
    return axios.get(`${API_URL}/profile/${id}`);
};

export const updateProfile = async (formData) => {
    return await axios.post(`${API_URL}/profile`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

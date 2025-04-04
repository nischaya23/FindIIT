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

export const banUser = async (id) => {
    return await axios.put(`${API_URL}/profile/ban/${id}`);
};

export const unbanUser = async (id) => {
    return await axios.put(`${API_URL}/profile/unban/${id}`);
};

export const makeAdmin = async (id) => {
    return await axios.put(`${API_URL}/profile/admin/${id}`);
};

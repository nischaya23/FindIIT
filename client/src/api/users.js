import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

export const getProfile = async () => {
    return axios.get(`${API_URL}/profile`);
};

export const updateProfile = async (formData) => {
    return await axios.post(`${API_URL}/profile`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

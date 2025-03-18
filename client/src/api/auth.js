import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const signup = async (email, password) => {
    return axios.post(`${API_URL}/signup`, { email, password });
};

export const verifyOTP = async (email, otp) => {
    return axios.post(`${API_URL}/verify-otp`, { email, otp });
};

export const login = async (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

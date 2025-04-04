import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const signup = async (email, password) => {
    return axios.post(`${API_URL}/signup`, { email, password });
};

export const verifyOTP = async (email, otp) => {
    return axios.post(`${API_URL}/verify-otp`, { email, otp });
};

export const forgot = async (email) => {
    return axios.post(`${API_URL}/forgot`, { email });
};

export const verifyOTPreset = async (email, otp, password) => {
    return axios.post(`${API_URL}/verify-otp-reset`, { email, otp, password });
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    // Store token automatically on successful login
    if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
    }

    return response;
};

export const logout = () => {
    localStorage.removeItem('token');
    // You might want to clear other stored data too
    // localStorage.removeItem('userData');
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const getID = () => {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.id || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export const isAuthenticated = () => {
    return getAuthToken() !== null;
};

// Add this to your axios requests
axios.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 responses (token expired)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            logout();
            window.location.href = '/welcome';
        }
        // if (error.response?.status === 404) {
        //     window.location.href = '/404';
        // }
        return Promise.reject(error);
    }
);
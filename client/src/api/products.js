import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

export const getProducts = async (search) => {
    return axios.get(`${API_URL}/?search=${search}`);
};

export const createProduct = async (formData) => {
    return axios.post(API_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

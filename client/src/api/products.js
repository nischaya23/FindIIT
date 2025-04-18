import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

export const getProducts = async (search, filter, category) => {
    return axios.get(`${API_URL}/?search=${search}&filter=${filter}&category=${category}`);
};

export const createProduct = async (formData) => {
    return axios.post(API_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getProductById = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

export const getProductsByUploader = async (id) => {
    return await axios.get(`${API_URL}/user/${id}`);
};

export const deleteProduct = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};

export const claimProduct = async (id) => {
    return await axios.post(`${API_URL}/${id}/claim`);
};

export const updateClaimStatus = async (id, claimID, status) => {
    return await axios.put(`${API_URL}/${id}/claim/${claimID}/${status}`);
};

import axios from 'axios'; 

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor për të shtuar token në çdo kërkesë
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = async (userData) => {
    try {
        return await api.post('/auth/register', userData);
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (userData) => api.post('/auth/login', userData);

export const fetchProducts = async () => api.get('/products');

export const addToCart = async (productId) => {
    return api.post('/cart/add', { productId, quantity: 1 });
};

export const addToWishlist = async (productId) => {
    return api.post('/wishlist/add', { productId });
};

export default api;
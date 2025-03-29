import axios from 'axios';

const baseUrl = window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://api.madhuramsliet.com';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
});

export default axiosInstance;
import axios from 'axios';

const baseUrl = window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://api.madhuramsliet.com';

const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
});

export default axiosInstance;
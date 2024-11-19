import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REQUEST_BASE_URL}/api/v1`,
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    config => config,
    error => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        return Promise.reject(error);
    },
);

export default axiosInstance;

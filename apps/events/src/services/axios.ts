import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REQUEST_BASE_URL}/api/v1/www`,
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    config => config,
    err => {
        return Promise.reject(err);
    },
);

axiosInstance.interceptors.response.use(
    response => response,
    async err => {
        return Promise.reject(err);
    },
);

export default axiosInstance;

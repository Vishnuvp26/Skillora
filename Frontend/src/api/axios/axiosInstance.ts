import { setAccessToken } from '@/redux/authSlice';
import axios from 'axios'
import store from '../../redux/store/store';
import { refreshToken } from '../auth/authApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Axios = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

Axios.interceptors.request.use(
    (config) => {
        const authToken = store.getState().user.accessToken;
        const token = authToken
        if (token) {
            config.headers["authorization"] = `Bearer ${token}`
        }
        return config
    }
);

Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalReq = error.config;
        if (error.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true;
            try {
                const response = await refreshToken();
                const newAccessToken = response.accessToken;
                store.dispatch(setAccessToken({ accessToken: newAccessToken }));
                originalReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return Axios(originalReq);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default Axios
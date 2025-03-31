// import axios from "axios";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { authService } from "./authService";

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;

type FailedRequest = {
    resolve: (value?: AxiosResponse) => void;
    reject: (reason?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });
    failedQueue = [];
};

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError): Promise<AxiosResponse | unknown> => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => axiosInstance(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await authService.refreshToken();
            processQueue(null);
            return axiosInstance(originalRequest);
        } catch (refreshError: unknown) {
            processQueue(refreshError);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);


export default axiosInstance;






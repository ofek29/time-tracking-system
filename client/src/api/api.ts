import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { authService } from "./authService";

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Store token in memory for API requests
let accessToken: string | null = null;

// Function to set the access token
export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

// Request Interceptor - add token to each request
axiosInstance.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

type FailedRequest = {
    resolve: (value?: AxiosResponse) => void;
    reject: (reason?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];
let isRefreshing = false;

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

// Response Interceptor - handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError): Promise<AxiosResponse | unknown> => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/refresh")) {
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
            const refreshResult = await authService.refreshToken();
            setAccessToken(refreshResult.accessToken);
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
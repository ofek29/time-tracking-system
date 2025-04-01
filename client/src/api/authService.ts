import axiosInstance from './api';

export const authService = {
    login: async (username: string, password: string) => {
        const response = await axiosInstance.post('/auth/login', { username, password });
        return response.data;
    },

    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },

    refreshToken: async () => {
        const response = await axiosInstance.post('/auth/refresh');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    }
};

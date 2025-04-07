import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../api/authService';
import { User } from '@/types/auth.types';
import { setAccessToken } from '@/api/api';
import { AxiosError } from 'axios';

// Define the shape of auth state
interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Define the shape of context value
interface AuthContextValue extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider props
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    });

    // Check if the user is already logged in when the app loads
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setState((prev) => ({
                    ...prev,
                    user: userData.user,
                    accessToken: userData.accessToken || prev.accessToken,
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                }));

            } catch {
                // If the get user request fails, try refreshing the token
                try {
                    const userData = await authService.refreshToken();
                    setState({
                        user: userData.user,
                        accessToken: userData.accessToken,
                        isAuthenticated: true,
                        loading: false,
                        error: null,
                    });
                } catch {
                    // If refresh fails too, the user is not authenticated
                    setState({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                        loading: false,
                        error: null,
                    });
                }
            }
        };

        checkAuthStatus();
    }, []);

    // Update the access token from the axios interceptor
    useEffect(() => {
        setAccessToken(state.accessToken);
    }, [state.accessToken]);

    // Login function
    const login = async (username: string, password: string) => {
        setState({ ...state, loading: true, error: null });
        try {
            const data = await authService.login(username, password);

            setState({
                user: data.user,
                accessToken: data.accessToken,
                isAuthenticated: true,
                loading: false,
                error: null,
            });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            setState({
                ...state,
                loading: false,
                error: axiosError.response?.data?.message ||
                    axiosError.message ||
                    'An error occurred during login',
            });
        }
    };

    // Logout function
    const logout = async () => {
        setState({ ...state, loading: true });
        try {
            await authService.logout();

        } finally {
            setState({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            });
        }
    };

    // Clear any auth errors
    const clearError = () => {
        setState({ ...state, error: null });
    };

    const value = {
        ...state,
        login,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
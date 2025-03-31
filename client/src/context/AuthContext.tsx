import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../api/authService';
import { User } from '@/types/auth.types';
import { useNavigate } from 'react-router-dom';

// Define the shape of auth state
interface AuthState {
    user: User | null;
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
        isAuthenticated: false,
        loading: false,
        error: null,
    });

    // Check if the user is already logged in when the app loads
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setState({
                    user: userData.user,
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                });

            } catch {
                // If the get user request fails, try refreshing the token
                try {
                    const userData = await authService.refreshToken();
                    setState({
                        user: userData.user,
                        isAuthenticated: true,
                        loading: false,
                        error: null,
                    });
                } catch {
                    // If refresh fails too, the user is not authenticated
                    setState({
                        user: null,
                        isAuthenticated: false,
                        loading: false,
                        error: null,
                    });
                }
            }
        };

        checkAuthStatus();
    }, []);

    // Login function
    const login = async (username: string, password: string) => {
        setState({ ...state, loading: true, error: null });
        try {
            const data = await authService.login(username, password);

            setState({
                user: data.user,
                isAuthenticated: true,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            setState({
                ...state,
                loading: false,
                error: error.message || 'Login failed',
            });
            throw error;
        }
    };

    const navigate = useNavigate();
    // Logout function
    const logout = async () => {
        setState({ ...state, loading: true });
        try {
            await authService.logout();

        } finally {
            setState({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            });
            navigate('/login');

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
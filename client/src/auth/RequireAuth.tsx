import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireAuthProps {
    role?: string;
}

export const RequireAuth = ({ role }: RequireAuthProps) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};
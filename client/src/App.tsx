import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import AdminPanel from './pages/AdminPanel';
// import { RequireAuth } from './auth/RequireAuth';


function App() {
  const { isAuthenticated, user } = useAuth();

  // Simple helper function to redirect based on user role
  const getHomeRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return user?.role === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>
      {/* Home route - redirects based on authentication and role */}
      <Route path="/" element={getHomeRedirect()} />

      {/* Login route - redirects authenticated users to their appropriate dashboard */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? (user?.role === "admin"
              ? <Navigate to="/admin" replace />
              : <Navigate to="/dashboard" replace />)
            : <Login />
        }
      />

      {/* User dashboard - only accessible to authenticated users with "user" role */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated && user?.role === "user"
            ? <Dashboard />
            : <Navigate to="/login" replace />
        }
      />

      {/* Admin panel - only accessible to authenticated users with "admin" role */}
      <Route
        path="/admin"
        element={
          isAuthenticated && user?.role === "admin"
            ? <AdminPanel />
            : <Navigate to="/login" replace />
        }
      />

      {/* Redirect to home for any unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
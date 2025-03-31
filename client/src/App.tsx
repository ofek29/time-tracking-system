import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
// import { RequireAuth } from './auth/RequireAuth';


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route> */}

      {/* Redirect to login if no route matches */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App
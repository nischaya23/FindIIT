// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';

const ProtectedRoute = () => {
    if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        return <Navigate to="/welcome" replace />;
    }

    // Render child routes if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
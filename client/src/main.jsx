import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Make sure you create this component
import ProtectedRoute from './components/ProtectedRoute'; // We'll need to create this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Redirect to login for any undefined routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </StrictMode>
);
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPass from './pages/ForgotPass';
import Profile from "./pages/Profile";
import Homepage from './pages/Homepage';
import AddItem from './pages/AddItem';
import ProductDetails from './pages/ProductDetails';
import ProtectedRoute from './components/ProtectedRoute';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPass />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Homepage />} />
          <Route path="/add_item" element={<AddItem />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Redirect to login for any undefined routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </StrictMode>
);
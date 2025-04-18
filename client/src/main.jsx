import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPass from './pages/ForgotPass';
import WelcomePage from './pages/WelcomePage'; // Import the WelcomePage component
import Profile from "./pages/Profile";
import Homepage from './pages/Homepage';
import AddItem from './pages/AddItem';
import ProductDetails from './pages/ProductDetails';
import NotFoundPage from './pages/404';
import ProtectedRoute from './components/ProtectedRoute';
import MyItems from "./pages/MyItems";
import ChatPage from "./pages/ChatPage";
import MapPage from './components/MapPage';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPass />} />
        <Route path="/welcome" element={<WelcomePage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Homepage />} />
          <Route path="/add_item" element={<AddItem />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/my-items" element={<MyItems />}/>
          <Route path="/map" element={<MapPage />} />

          {/* Add more protected routes here */}
        </Route>
        {/* Redirect to 404 for any undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </StrictMode>
);

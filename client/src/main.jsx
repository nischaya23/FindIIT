import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Chat from "./pages/Chat";
import MyItems from "./pages/MyItems";
import PreviousChats from "./pages/PreviousChats";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPass />} />
        <Route path="/welcome" element={<WelcomePage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/previous-chats" element={<PreviousChats />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Homepage />} />
          <Route path="/add_item" element={<AddItem />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/my-items" element={<MyItems />} />
          {/* Add more protected routes here */}
        </Route>
        {/* Redirect to 404 for any undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </StrictMode>
);

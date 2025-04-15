import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getAuthToken } from '../api/auth';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: '',
    email: 'Loading...'
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );

      const decodedPayload = JSON.parse(jsonPayload);

      setUserData({
        id: decodedPayload.id || 'ID not available',
        email: decodedPayload.email || 'Email not available'
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      setUserData({
        id: 'Error decoding token',
        email: 'Error decoding token'
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard! You are logged in.</p>
      <p><strong>User ID:</strong> {userData.id}</p>
      <p><strong>Email:</strong> {userData.email}</p>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: 'black',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
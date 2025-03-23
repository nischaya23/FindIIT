import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapPage from './components/MapPage.jsx';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="logo">
            <Link to="/">FIND IIT</Link>
          </div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/history">History</Link>
            <Link to="/map">Map</Link>
            <Link to="/profile">Profile</Link>
          </nav>
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/history" element={<div>History Page</div>} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
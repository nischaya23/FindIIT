import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonField } from './AuthLayout';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const myRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    // Load the required scripts dynamically
    const loadScripts = async () => {
      // Load Three.js first
      const threeScript = document.createElement('script');
      threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
      document.body.appendChild(threeScript);
      
      // Load Vanta Waves after Three.js
      threeScript.onload = () => {
        const vantaScript = document.createElement('script');
        vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta/dist/vanta.waves.min.js";
        document.body.appendChild(vantaScript);
        
        // Initialize Vanta effect after script is loaded
        vantaScript.onload = () => {
          if (!vantaEffect) {
            const effect = window.VANTA.WAVES({
              el: myRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: 0x0,
              shininess: 36.00,
              waveHeight: 19.00,
              waveSpeed: 1.05
            });
            setVantaEffect(effect);
          }
        };
      };
    };
    
    loadScripts();
    
    // Cleanup function
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-page" ref={myRef}>
      {/* Main content */}
      <div className="welcome-content">
        <h1>Welcome To FINDIIT</h1>
        <p>Lost something on campus? We'll help you find it!</p>
      </div>
      
      {/* Login button at the bottom */}
      <div className="login-button-container">
        <ButtonField onClick={handleLoginClick} className="welcome-button">
          Click Here to Login
        </ButtonField>
      </div>
    </div>
  );
};

export default WelcomePage;

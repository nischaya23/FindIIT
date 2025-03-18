import { useState } from "react";
import { login } from "../api/auth";
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await login(email, password);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#2d2d2d" }}>
            <div style={{ width: "650px", display: "flex", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", borderRadius: "16px", overflow: "hidden", aspectRatio: "4/3" }}>
                {/* Left Panel */}
                <div style={{ width: "50%", backgroundColor: "black", color: "white", padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px" }}>
                    <h3 style={{ fontSize: "18px", fontFamily: "serif" }}>You Lost it?</h3>
                    <h4 style={{ fontSize: "18px", fontFamily: "serif" }}>We will</h4>
                    <h1 style={{ fontSize: "32px", fontWeight: "bold", marginTop: "8px", fontFamily: "serif" }}>FindIIT</h1>
                    <div style={{ marginTop: "24px" }}>
                        <div style={{ width: "64px", height: "64px", backgroundColor: "#555", borderRadius: "50%", opacity: "0.4" }}></div>
                        <div style={{ width: "40px", height: "40px", backgroundColor: "#777", borderRadius: "50%", opacity: "0.4", marginTop: "16px" }}></div>
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{ width: "50%", backgroundColor: "white", padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", borderTopRightRadius: "16px", borderBottomRightRadius: "16px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "600", textAlign: "center", fontFamily: "serif" }}>Login to Account</h2>

                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "12px" }} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "12px" }} />
                    <button onClick={handleLogin} style={{ width: "100%", backgroundColor: "black", color: "white", padding: "12px", borderRadius: "8px", cursor: "pointer" }}>Log In</button>

                    <p style={{ textAlign: "center", color: "#666", fontSize: "14px", marginTop: "16px", fontFamily: "serif" }}>
                        New User? <Link to="/" style={{ color: "black", fontWeight: "600" }}>Signup here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
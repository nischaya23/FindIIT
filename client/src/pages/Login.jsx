import { useEffect, useState } from "react";
import { login } from "../api/auth";
import { AuthLayout, InputField, ButtonField, RedirectField, HeadingField } from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import {Eye , EyeClosed} from "lucide-react";
import { toast } from 'react-toastify';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setLoading(true);
            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    const handleKeyDown = (e) => {
        // console.log("key pressed" , e.key);
        if(e.key === "Enter"){
            handleLogin();
        }
    }

    useEffect(()=>{
        
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [email,password]);
    
    return (
        <AuthLayout>
            <HeadingField>Login to Account</HeadingField>
            <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="eyePassword">
                <input 
                    type={showPassword ? "text" : "password"}  
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="input-field password-input"
                />
                <button 
                    type="button" 
                    className="eye-icon" 
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <ButtonField onClick={handleLogin} disabled={loading}>Log In</ButtonField>
            <RedirectField link="/signup" already="New User?" todo="Signup here" />
            <RedirectField link="/forgot" already="Forgot Password?" todo="Reset here" />
        </AuthLayout>
    );
};

export default Login;
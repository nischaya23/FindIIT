import { useState } from "react";
import { login } from "../api/auth";
import { AuthLayout, InputField, ButtonField, RedirectField, HeadingField } from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setLoading(true);
            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <HeadingField>Login to Account</HeadingField>
            <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <ButtonField onClick={handleLogin} disabled={loading}>Log In</ButtonField>
            <RedirectField link="/signup" already="New User?" todo="Signup here" />
            <RedirectField link="/forgot" already="Forgot Password?" todo="Reset here" />
        </AuthLayout>
    );
};

export default Login;
import { useState } from "react";
import { login } from "../api/auth";
import { AuthLayout, InputField, ButtonField, RedirectField, HeadingField } from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await login(email, password).then((res) => alert(res.data.message));
            navigate("/dashboard");
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <AuthLayout>
            <HeadingField>Login to Account</HeadingField>
            <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <ButtonField onClick={handleLogin}>Log In</ButtonField>
            <RedirectField link="/signup" already="New User?" todo="Signup here" />
            <RedirectField link="/forgot" already="Forgot Password?" todo="Reset here" />
        </AuthLayout>
    );
};

export default Login;
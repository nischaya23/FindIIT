import { useState } from "react";
import { login } from "../api/auth";
import { AuthLayout, InputField, ButtonField, RedirectField, HeadingField } from '../components/AuthLayout';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await login(email, password);
            alert("Login successful");
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
        </AuthLayout>
    );
};

export default Login;
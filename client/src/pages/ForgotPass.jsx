import { useState } from "react";
import { forgot, verifyOTPreset } from "../api/auth";
import { AuthLayout, InputField, ButtonField, RedirectField, HeadingField } from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();


    const handleForgot = async () => {
        try {
            await forgot(email).then((res) => alert(res.data.message));
            setStep(2);
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    const handleVerifyOTPreset = async () => {
        try {
            if (password !== confirm_password) {
                alert("Passwords do not match");
                return;
            }
            await verifyOTPreset(email, otp, password).then((res) => alert(res.data.message));
            navigate("/login");
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    return (
        <AuthLayout>
            <HeadingField>Forgot Password</HeadingField>

            {step === 1 ? (
                <>
                    <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <ButtonField onClick={handleForgot}>Send OTP</ButtonField>
                </>
            ) : (
                <>
                    <InputField type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputField type="password" placeholder="Confirm Password" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <ButtonField onClick={handleVerifyOTPreset}>Reset Password</ButtonField>
                </>
            )}

            <RedirectField link="/login" already="Remembered your password?" todo="Log in here" />
        </AuthLayout>
    );
};

export default Signup;
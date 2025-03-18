import { useState } from "react";
import { signup, verifyOTP } from "../api/auth";
import { AuthLayout, InputField, ButtonField, RedirectField, HeadingField } from '../components/AuthLayout';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);

    const handleSignup = async () => {
        try {
            if (password !== confirm_password) {
                alert("Passwords do not match");
                return;
            }
            if (!email.endsWith('@iitk.ac.in')) {
                alert("Please use your IITK email address");
                return;
            }
            await signup(email, password);
            alert("OTP sent to your email");
            setStep(2);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await verifyOTP(email, otp);
            alert("Signup successful");
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <AuthLayout>
            <HeadingField>Create Account</HeadingField>

            {step === 1 ? (
                <>
                    <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputField type="password" placeholder="Confirm Password" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <ButtonField onClick={handleSignup}>Sign Up</ButtonField>
                </>
            ) : (
                <>
                    <InputField type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <ButtonField onClick={handleVerifyOTP}>Verify OTP</ButtonField>
                </>
            )}

            <RedirectField link="/login" already="Already have account?" todo="Login here" />
        </AuthLayout>
    );
};

export default Signup;
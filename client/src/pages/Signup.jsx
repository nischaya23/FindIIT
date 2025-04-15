import { useState , useEffect} from "react";
import { signup, verifyOTP } from "../api/auth";
import { AuthLayout, InputField, ButtonField, RedirectField, HeadingField } from '../components/AuthLayout';
import { useNavigate } from "react-router-dom";
import {Eye , EyeClosed} from "lucide-react";
import { toast } from 'react-toastify';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            setLoading(true);
            if (password !== confirm_password) {
                // alert("Passwords do not match");
                toast.warning("Passwords do not match");
                return;
            }
            await signup(email, password).then((res) => alert(res.data.message));
            setStep(2);
        } catch (error) {
            // alert(error.response.data.message);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            setLoading(true);
            await verifyOTP(email, otp).then((res) => alert(res.data.message));
            navigate("/login");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        // console.log("key pressed" , e.key);
        if(e.key === "Enter"){
            if (step === 1) {
                handleSignup();
            } 
            else if (step === 2) {
                handleVerifyOTP();
            }
        }
    }
    
    useEffect(()=>{
        
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [step , email , password , confirm_password , otp]);

    return (
        <AuthLayout>
            <HeadingField>Create Account</HeadingField>

            {step === 1 ? (
                <>
                    <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {/* <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> */}
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
                    <InputField type="password" placeholder="Confirm Password" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <ButtonField onClick={handleSignup} disabled={loading}>Sign Up</ButtonField>
                </>
            ) : (
                <>
                    <InputField type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <ButtonField onClick={handleVerifyOTP} disabled={loading}>Verify OTP</ButtonField>
                </>
            )}

            <RedirectField link="/login" already="Already have account?" todo="Login here" />
        </AuthLayout>
    );
};

export default Signup;
import { useState , useEffect} from "react";
import { forgot, verifyOTPreset } from "../api/auth";
import { AuthLayout, InputField, ButtonField, RedirectField, HeadingField } from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import {Eye , EyeClosed} from "lucide-react";
import {toast} from 'react-toastify';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();


    const handleForgot = async () => {
        try {
            setLoading(true);
            await forgot(email).then((res) => toast.info(res.data.message));
            setStep(2);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOTPreset = async () => {
        try {
            setLoading(true);
            if (password !== confirm_password) {
                toast.error("Passwords do not match");
                return;
            }
            await verifyOTPreset(email, otp, password).then((res) => toast.error(res.data.message));
            navigate("/login");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
        // console.log("key pressed" , e.key);
        if(e.key === "Enter"){
            if(step === 1){
                handleForgot();
            }
            else if(step === 2){
                handleVerifyOTPreset();
            }
        }
    }

    useEffect(()=>{
        
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [step ,email,password,confirm_password,otp]);

    return (
        <AuthLayout>
            <HeadingField>Forgot Password</HeadingField>

            {step === 1 ? (
                <>
                    <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <ButtonField onClick={handleForgot} disabled={loading}>Send OTP</ButtonField>
                </>
            ) : (
                <>
                    <InputField type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    {/* <InputField type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} /> */}
                    <div className="eyePassword">
                        <input 
                            type={showPassword ? "text" : "password"}  
                            placeholder="New Password" 
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
                    <ButtonField onClick={handleVerifyOTPreset} disabled={loading}>Reset Password</ButtonField>
                </>
            )}

            <RedirectField link="/login" already="Remembered your password?" todo="Log in here" />
        </AuthLayout>
    );
};

export default Signup;

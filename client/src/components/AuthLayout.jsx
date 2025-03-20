import { Link } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = ({ children }) => (
    <div className="auth-container">
        <div className="auth-box">
            {/* Left Panel */}
            <div className="auth-left">
                <h3>You Lost it?</h3>
                <h4>We will</h4>
                <h1>FindIIT</h1>
                <div className="auth-icons">
                    <div className="auth-icon-large"></div>
                    <div className="auth-icon-small"></div>
                </div>
            </div>
            {/* Right Panel */}
            <div className="auth-right">
                {children}
            </div>
        </div>
    </div>
);

const HeadingField = ({ children }) => (
    <h2 className="heading-field">{children}</h2>
);

const InputField = ({ type, placeholder, value, onChange }) => (
    <input className="input-field" type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

const ButtonField = ({ onClick, disabled, children }) => (
    <button className="button-field" onClick={onClick} disabled={disabled}>
        {disabled ? "Processing..." : children}
    </button>
);

const RedirectField = ({ link, already, todo }) => (
    <p className="redirect-field">
        {already} <Link to={link}>{todo}</Link>
    </p>
);

export { AuthLayout, InputField, ButtonField, RedirectField, HeadingField };
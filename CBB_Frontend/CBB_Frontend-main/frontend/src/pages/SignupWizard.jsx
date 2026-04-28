import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Landmark,
    User,
    Smartphone,
    Mail,
    CreditCard,
    AtSign,
    Lock,
    Eye,
    EyeOff,
    RefreshCw,
    UserPlus,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import './SignupWizard.css';

const SignupWizard = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        accountNumber: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registering:', formData);
        navigate('/');
    };

    return (
        <div className="signup-page-container">
            <div className="signup-card">
                {/* Header */}
                <div className="signup-header">
                    <div className="header-icon-box">
                        <Landmark size={24} color="white" />
                    </div>
                    <h2 className="brand-name">Banking System</h2>
                </div>

                <h1 className="page-title">Create Your Account</h1>
                <p className="page-subtitle">Enter your details to register for online banking services</p>

                <form onSubmit={handleSubmit} className="signup-form">
                    {/* Row 1 */}
                    <div className="form-row">
                        <div className="form-group half-width">
                            <label>Full Name</label>
                            <div className="input-group">
                                <User className="field-icon" size={18} />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group half-width">
                            <label>Mobile Number</label>
                            <div className="input-group">
                                <Smartphone className="field-icon" size={18} />
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="form-row">
                        <div className="form-group half-width">
                            <label>Email ID</label>
                            <div className="input-group">
                                <Mail className="field-icon" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group half-width">
                            <label>Account Number</label>
                            <div className="input-group">
                                <CreditCard className="field-icon" size={18} />
                                <input
                                    type="text"
                                    name="accountNumber"
                                    placeholder="XXXX-XXXX-XXXX"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Username */}
                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-group">
                            <AtSign className="field-icon" size={18} />
                            <input
                                type="text"
                                name="username"
                                placeholder="johndoe88"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Passwords */}
                    <div className="form-row">
                        <div className="form-group half-width">
                            <label>Password</label>
                            <div className="input-group">
                                <Lock className="field-icon" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="toggle-pw"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group half-width">
                            <label>Confirm Password</label>
                            <div className="input-group">
                                <RefreshCw className="field-icon" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* OTP Section */}
                    <div className="otp-container">
                        <div className="otp-header-row">
                            <div className="otp-title-group">
                                <CheckCircle2 color="#2563eb" size={20} fill="none" />
                                <h3>OTP Verification</h3>
                            </div>
                            <button type="button" className="get-otp-btn">Get OTP</button>
                        </div>
                        <p className="otp-desc">A 6-digit code will be sent to your Registered Email.</p>
                        <div className="otp-inputs">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    className="otp-box"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Register Button */}
                    <button type="submit" className="register-btn">
                        <UserPlus size={18} /> Register
                    </button>

                    <div className="login-redirect">
                        Already have an account? <span onClick={() => navigate('/')}>Login here</span>
                    </div>
                </form>

                {/* Footer Badges */}
                <div className="security-footer">
                    <div className="badge">
                        <ShieldCheck size={14} /> <span>SSL SECURED</span>
                    </div>
                    <div className="badge">
                        <ShieldCheck size={14} /> <span>PCI-DSS COMPLIANT</span>
                    </div>
                    <div className="badge">
                        <ShieldCheck size={14} /> <span>256-BIT ENCRYPTION</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupWizard;

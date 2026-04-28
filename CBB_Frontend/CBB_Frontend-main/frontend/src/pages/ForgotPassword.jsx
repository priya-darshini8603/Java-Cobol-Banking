import React, { useState } from "react";
import api from "../services/api";
import { Mail, KeyRound, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const sendOtp = async () => {
    setError("");

    if (!email.includes("@")) {
      setError("Enter valid email address");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      toast.success("OTP sent to registered email ✔");
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Email not registered");
    } finally {
      setLoading(false);
    }
  };

 
  const verifyOtp = async () => {
    setError("");

    if (otp.length !== 6) {
      setError("Enter valid 6 digit OTP");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/verify-reset-otp", {
        email: email.trim().toLowerCase(),
        otp: otp,
      });

      toast.success("OTP Verified ✔");
      setStep(3);
    } catch (err) {
      setError(err.response?.data || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");

    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password-otp", {
        email: email.trim().toLowerCase(),
        otp: otp,
        newPassword: newPassword,
      });

      toast.success("Password Reset Successful ✔");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(err.response?.data || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> Back to Login
        </button>

        <h2>Reset Your Password</h2>
        <p className="subtitle">Secure account recovery</p>

        {/* STEP 1 → EMAIL */}
        {step === 1 && (
          <div className="form">
            <div className="input">
              <Mail size={16} />
              <input
                type="email"
                placeholder="Registered Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button onClick={sendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 → VERIFY OTP */}
        {step === 2 && (
          <div className="form">
            <div className="input">
              <KeyRound size={16} />
              <input
                type="text"
                placeholder="Enter 6 digit OTP"
                value={otp}
                maxLength={6}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <button onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* STEP 3 → NEW PASSWORD */}
        {step === 3 && (
          <div className="form">
            <div className="input">
              <Lock size={16} />
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button onClick={resetPassword} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default ForgotPassword;
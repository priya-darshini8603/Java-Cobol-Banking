import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";
import "./SignupSteps.css";
import api from "../services/api";
import { toast } from 'react-toastify';

const SignupSteps = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    accountType: "SAVINGS",
    deposit: 500,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.dob ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.zip
    ) {
      setError("Fill all personal details");
      return;
    }
    setError("");
    setStep(2);
  };

  const createAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;

      await api.post("/accounts/create", {
        customerId: userId,
        accountType: form.accountType,
        initialDeposit: Number(form.deposit),
      });

      toast.success("Account Created Successfully ✅");
      navigate("/user-dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to create account");
    }
  };

  return (
    <div className="wizard-wrapper">
      {/* HEADER */}
      <div className="wizard-header">
        <div className="logo">
          <Landmark size={26} />
          <h2>Modern Bank</h2>
        </div>
        <button onClick={() => navigate("/user-dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="wizard-card">
        {/* STEP BAR */}
        <div className="stepper">
          <div className={`circle ${step === 1 ? "active" : ""}`}>1</div>
          <div className="bar"></div>
          <div className={`circle ${step === 2 ? "active" : ""}`}>2</div>
        </div>

        {step === 1 && (
          <>
            <h2 className="title">Personal Information</h2>

            <div className="grid-2">
              <input name="firstName" placeholder="First Name" onChange={handleChange} />
              <input name="lastName" placeholder="Last Name" onChange={handleChange} />
            </div>

            <input name="dob" placeholder="Date of Birth" onChange={handleChange} />
            <input name="address" placeholder="Address" onChange={handleChange} />

            <div className="grid-3">
              <input name="city" placeholder="City" onChange={handleChange} />
              <input name="state" placeholder="State" onChange={handleChange} />
              <input name="zip" placeholder="ZIP Code" onChange={handleChange} />
            </div>

            {error && <p className="error">{error}</p>}

            <button className="primary-btn" onClick={nextStep}>
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="title">Account Details</h2>

            <label>Account Type</label>
            <select name="accountType" onChange={handleChange}>
              <option value="SAVINGS">Savings Account</option>
              <option value="CURRENT">Current Account</option>
            </select>

            <label>Initial Deposit</label>
            <input
              type="number"
              name="deposit"
              defaultValue={500}
              onChange={handleChange}
            />

            {error && <p className="error">{error}</p>}

            <div className="button-row">
              <button className="secondary-btn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="primary-btn" onClick={createAccount}>
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupSteps;
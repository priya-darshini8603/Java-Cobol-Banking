import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });

  const [detectedRole, setDetectedRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm({ ...form, phone: onlyNumbers });
    }

    else if (name === "email") {
      const email = value.toLowerCase().trim();
      setForm({ ...form, email });

      if (email.includes("@")) {
        const domain = email.split("@")[1];

        if (domain === "gmail.com") {
          setDetectedRole("CUSTOMER");
        } else if (domain === "bank.com") {
          setDetectedRole("ADMIN");
        } else {
          setDetectedRole("INVALID");
        }
      } else {
        setDetectedRole("");
      }
    }

    else {
      setForm({ ...form, [name]: value });
    }
  };


  const register = async (e) => {
    e.preventDefault();
    setError("");

    if (form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    if (detectedRole === "INVALID" || !detectedRole) {
      setError("Invalid email domain");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);

      if (res.data === "ADMIN") {
        toast.success("Admin Registered Successfully ✔ Please Login");
      } else if (res.data === "CUSTOMER") {
        toast.success("User Registered Successfully ✔ Please Login");
      } else {
        toast.success("Registered Successfully ✔ Please Login");
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed"
      );
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Sign Up</h2>

<form onSubmit={register}>

  <input
    type="text"
    name="fullName"
    placeholder="Full Name"
    value={form.fullName}
    onChange={handleChange}
    required
  />

  <input
    type="email"
    name="email"
    placeholder="Email"
    value={form.email}
    onChange={handleChange}
    required
  />

  <input
    type="tel"
    name="phone"
    placeholder="Enter 10-digit phone"
    value={form.phone}
    onChange={handleChange}
    maxLength={10}
    pattern="[0-9]{10}"
    required
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    required
  />

  {/* ROLE PREVIEW MOVED HERE */}
  {detectedRole && (
    <p className={
      detectedRole === "ADMIN"
        ? "role admin"
        : detectedRole === "CUSTOMER"
        ? "role user"
        : "role invalid"
    }>
      {detectedRole === "INVALID"
        ? "Invalid Email Domain"
        : `Role: ${detectedRole}`}
    </p>
  )}

  {error && <p className="error">{error}</p>}

  <button disabled={loading}>
    {loading ? "Registering..." : "Register"}
  </button>

  <p className="login-link">
    Already have account?{" "}
    <span onClick={() => navigate("/")}>Login</span>
  </p>

</form>

      </div>
    </div>
  );
};

export default Register;
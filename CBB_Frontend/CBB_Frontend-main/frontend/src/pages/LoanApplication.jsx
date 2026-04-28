import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ArrowLeft, ArrowRight, ChevronDown, UserCircle } from 'lucide-react';
import './LoanApplication.css';
import { toast } from 'react-toastify';

const LoanApplication = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        loanType: 'Personal Loan',
        amount: '',
        purpose: '',
        tenure: '12 months',
        employmentStatus: 'Full-time Employed',
        employerName: '',
        monthlyIncome: '',
        creditScore: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (!formData.amount || !formData.purpose) {
            setError('Please fill all loan details.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleBack = () => setStep(1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.employerName || !formData.monthlyIncome || !formData.creditScore) {
            setError('Please fill all employment details.');
            return;
        }

        if (formData.creditScore < 300 || formData.creditScore > 900) {
            setError('Credit score must be between 300 and 900.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem("token");
            if (!token) throw new Error("Session expired. Login again.");

            // ================= LOAN TYPE FIX =================
            const loanTypeMap = {
                "Personal Loan": "PERSONAL",
                "Home Loan": "HOME",
                "Car Loan": "CAR"
            };

            const selectedLoanType = loanTypeMap[formData.loanType];
            if (!selectedLoanType) {
                throw new Error("Invalid loan type selected.");
            }

            const payload = {
                loanType: selectedLoanType,
                loanAmount: Number(formData.amount),
                tenureMonths: Number(formData.tenure.split(" ")[0]),
                salary: Number(formData.monthlyIncome),
                creditScore: Number(formData.creditScore)
            };

            const res = await fetch("http://localhost:8080/api/loans/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Loan application failed");
            }

            toast.success("Loan submitted successfully! Await admin approval.");
            navigate('/user-dashboard');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loan-container">
            <nav className="loan-nav">
                <div className="nav-left">
                    <div className="logo-box">
                        <Landmark size={20} color="black" />
                    </div>
                    <span className="brand-name">Bank</span>
                </div>

                <div className="nav-right">
                    <button className="loan-back-btn" onClick={() => navigate('/user-dashboard')}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <UserCircle size={32} color="#9CA3AF" />
                </div>
            </nav>

            <div className="loan-content">
                <div className="loan-card">
                    <h1 className="loan-title">Loan Application</h1>
                    <p className="loan-subtitle">Step {step} of 2</p>

                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: step === 1 ? '50%' : '100%' }}></div>
                    </div>

                    {/* ================= STEP 1 ================= */}
                    {step === 1 && (
                        <div className="step-content">

                            <div className="form-group">
                                <label>Loan Type</label>
                                <div className="select-container">
                                    <select name="loanType" value={formData.loanType} onChange={handleChange} className="form-select">
                                        <option value="Personal Loan">Personal Loan</option>
                                        <option value="Home Loan">Home Loan</option>
                                        <option value="Car Loan">Auto / Car Loan</option>
                                    </select>
                                    <ChevronDown size={16} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Loan Amount</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Purpose</label>
                                <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Tenure</label>
                                <div className="select-container">
                                    <select name="tenure" value={formData.tenure} onChange={handleChange} className="form-select">
                                        <option value="12 months">12 months</option>
                                        <option value="24 months">24 months</option>
                                        <option value="36 months">36 months</option>
                                        <option value="48 months">48 months</option>
                                        <option value="60 months">60 months</option>
                                    </select>
                                    <ChevronDown size={16} />
                                </div>
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <div className="form-actions">
                                <button className="btn-cancel" onClick={() => navigate('/user-dashboard')}>
                                    Cancel
                                </button>
                                <button className="btn-next" onClick={handleNext}>
                                    Next <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 2 ================= */}
                    {step === 2 && (
                        <div className="step-content">

                            <div className="form-group">
                                <label>Employer Name</label>
                                <input type="text" name="employerName" value={formData.employerName} onChange={handleChange} className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Monthly Income</label>
                                <input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Credit Score</label>
                                <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} className="form-input" />
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <div className="form-actions">
                                <button className="btn-cancel" onClick={handleBack}>
                                    Back
                                </button>
                                <button className="btn-next" onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Submitting..." : "Submit Application"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanApplication;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Landmark, UserCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import './DepositWithdraw.css';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const DepositWithdraw = () => {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        type: 'Deposit',
        accountNumber: '',
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: ''
    });

    // 🔥 GET LOGGED-IN USER ACCOUNTS (SECURE)
    useEffect(() => {
        api.get("/accounts/my-accounts")
            .then(res => setAccounts(res.data))
            .catch(err => {
                console.error("Account load failed", err);
                setError("Session expired. Please login again.");
                navigate('/login');
            });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        const { type, accountNumber, fromAccount, toAccount, amount } = formData;

        if (!amount || Number(amount) <= 0)
            return setError("Enter a valid amount.");

        if ((type === "Deposit" || type === "Withdraw") && !accountNumber)
            return setError("Select an account.");

        if (type === "Transfer") {
            if (!fromAccount || !toAccount)
                return setError("Both From and To accounts are required.");
            if (fromAccount === toAccount)
                return setError("Cannot transfer to same account.");
        }

        setError('');
        setStep(2);
    };

    const handleBack = () => setStep(1);

    const handleConfirm = async () => {
        try {
            let response;

            if (formData.type === "Deposit") {
                response = await api.post("/bank/deposit", {
                    accountNumber: Number(formData.accountNumber),
                    amount: Number(formData.amount),
                    description: formData.description
                });
            } else if (formData.type === "Withdraw") {
                response = await api.post("/bank/withdraw", {
                    accountNumber: Number(formData.accountNumber),
                    amount: Number(formData.amount),
                    description: formData.description
                });
            } else {
                response = await api.post("/bank/transfer", {
                    fromAccountNumber: Number(formData.fromAccount),
                    toAccountNumber: Number(formData.toAccount),
                    amount: Number(formData.amount),
                    description: formData.description
                });
            }
            toast.success(response.data.message || "Transaction Successful!");
            navigate('/user-dashboard');

        } catch (err) {
            const message = err.response?.data?.message || "Transaction failed";
            toast.error("❌ " + message);
        }
    };

    return (
        <div className="dw-container">
            <nav className="dw-nav">
                <div className="dw-nav-left">
                    <div className="dw-logo-box"><Landmark size={20} color="white" /></div>
                    <span className="dw-brand-name">Bank</span>
                </div>
                <div className="dw-nav-right">
                    <button className="dw-back-btn" onClick={() => navigate('/user-dashboard')}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="profile-circle">
                        <UserCircle size={32} color="#D1D5DB" fill="#F3F4F6" />
                    </div>
                </div>
            </nav>

            <div className="dw-content">

                {step === 1 && (
                    <div className="dw-card">
                        <h1 className="dw-title">Transaction</h1>
                        <p className="dw-subtitle">Step 1 of 2</p>

                        <div className="form-group">
                            <label>Transaction Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="dw-select">
                                <option value="Deposit">Deposit</option>
                                <option value="Withdraw">Withdraw</option>
                                <option value="Transfer">Transfer</option>
                            </select>
                        </div>

                        {(formData.type === 'Deposit' || formData.type === 'Withdraw') && (
                            <div className="form-group">
                                <label>Select Account</label>
                                <select name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="dw-select">
                                    <option value="">-- Select Account --</option>
                                    {accounts.map(acc => (
                                        <option key={acc.accountNumber} value={acc.accountNumber}>
                                            {acc.accountNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {formData.type === 'Transfer' && (
                            <>
                                <div className="form-group">
                                    <label>From Account</label>
                                    <select name="fromAccount" value={formData.fromAccount} onChange={handleChange} className="dw-select">
                                        <option value="">-- Select Account --</option>
                                        {accounts.map(acc => (
                                            <option key={acc.accountNumber} value={acc.accountNumber}>
                                                {acc.accountNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>To Account</label>
                                    <input
                                        type="text"
                                        name="toAccount"
                                        placeholder="Receiver account"
                                        value={formData.toAccount}
                                        onChange={handleChange}
                                        className="dw-input"
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label>Amount</label>
                            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="dw-input" />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" name="description" value={formData.description} onChange={handleChange} className="dw-input" />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <div className="dw-actions">
                            <button className="dw-btn-outline" onClick={() => navigate('/user-dashboard')}>
                                <ArrowLeft size={16} /> Cancel
                            </button>
                            <button className="dw-btn-primary" onClick={handleNext}>
                                Next <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="dw-card">
                        <h1 className="dw-title center-text">Confirm Transaction</h1>

                        <div className="summary-row"><span>Type:</span><span>{formData.type}</span></div>

                        {(formData.type === "Deposit" || formData.type === "Withdraw") && (
                            <div className="summary-row">
                                <span>Account:</span>
                                <span>**** {formData.accountNumber.slice(-4)}</span>
                            </div>
                        )}

                        {formData.type === "Transfer" && (
                            <>
                                <div className="summary-row"><span>From:</span><span>**** {formData.fromAccount.slice(-4)}</span></div>
                                <div className="summary-row"><span>To:</span><span>**** {formData.toAccount.slice(-4)}</span></div>
                            </>
                        )}

                        <div className="summary-row">
                            <span>Amount:</span>
                            <span>₹{parseFloat(formData.amount).toFixed(2)}</span>
                        </div>

                        <div className="dw-actions">
                            <button className="dw-btn-outline" onClick={handleBack}><ArrowLeft size={16} /> Back</button>
                            <button className="dw-btn-primary" onClick={handleConfirm}>Confirm</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepositWithdraw;

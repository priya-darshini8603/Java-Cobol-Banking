import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Landmark, ArrowLeft, UserCircle } from 'lucide-react';
import './TransactionHistory.css';


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

const TransactionHistory = () => {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔥 Fetch logged-in user's transactions
    useEffect(() => {
        api.get("/transactions/my-transactions")
            .then(res => {
                setTransactions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching transactions", err);
                setLoading(false);
                navigate('/login'); // token expired or invalid
            });
    }, [navigate]);

    return (
        <div className="th-container">
            <nav className="th-nav">
                <div className="th-nav-left">
                    <div className="th-logo-box">
                        <Landmark size={20} color="black" />
                    </div>
                    <span className="th-brand-name">Bank</span>
                </div>
                <div className="th-nav-right">
                    <button className="th-back-btn" onClick={() => navigate('/user-dashboard')}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <div className="profile-wrapper">
                        <UserCircle size={32} color="#9CA3AF" />
                    </div>
                </div>
            </nav>

            <div className="th-content">
                <div className="th-card">
                    <div className="th-header">
                        <h1 className="th-title">Transaction History</h1>
                        <p className="th-subtitle">View all your recent transactions</p>
                    </div>

                    <div className="th-table-container">
                        <table className="th-table">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Account</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6">Loading...</td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">No recent transactions found.</td>
                                    </tr>
                                ) : (
                                    transactions.map(txn => (
                                        <tr key={txn.transactionId}>
                                            <td>{txn.transactionId}</td>
                                            <td>{txn.date}</td>
                                            <td>{txn.type}</td>
                                            <td>**** {String(txn.account).slice(-4)}</td>
                                            <td>
                                                {Number(txn.amount).toLocaleString('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR'
                                                })}
                                            </td>
                                            <td className={`status ${txn.status.toLowerCase()}`}>
                                                {txn.status}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="th-pagination">
                        <span>Showing {transactions.length} results</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;

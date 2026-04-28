import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, UserCircle } from 'lucide-react';
import api from "../services/api";
import './LoanApproval.css';

const LoanApproval = () => {
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const res = await api.get("/api/loans/admin/pending");
            setLoans(res.data);
        } catch (err) {
            console.log("Loan fetch error", err);
        }
    };

    const approveLoan = async (id) => {
        await api.put(`/api/loans/${id}/approve`);
        fetchLoans();
    };

    const rejectLoan = async (id) => {
        await api.put(`/api/loans/${id}/reject`);
        fetchLoans();
    };

    const getStatusBadge = (status) => {
        if (status === "APPROVED") return <span className="badge approved">Approved</span>;
        if (status === "REJECTED") return <span className="badge rejected">Rejected</span>;
        return <span className="badge pending">Pending</span>;
    };

    return (
        <div className="la-container">

            {/* NAVBAR */}
            <nav className="la-nav">
                <div className="la-nav-left">
                    <Landmark size={20} />
                    <span className="la-brand">CoreBank</span>
                </div>

                <div className="la-nav-right">
                    <button className="back-btn" onClick={() => navigate('/admin-dashboard')}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <UserCircle size={30} />
                </div>
            </nav>

            {/* CONTENT */}
            <div className="la-content">
                <div className="la-card">

                    <h2>Loan Approval Management</h2>
                    <p className="subtitle">Review and process loan applications</p>

                    {loans.length === 0 ? (
                        <div className="empty">No pending loans</div>
                    ) : (
                        <table className="loan-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Tenure</th>
                                    <th>EMI</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loans.map((loan) => (
                                    <tr key={loan.loanId}>
                                        <td>{loan.loanId}</td>
                                        <td>{loan.customerId}</td>
                                        <td>₹ {loan.loanAmount}</td>
                                        <td>{loan.tenureMonths} months</td>
                                        <td>₹ {loan.emi}</td>
                                        <td>{getStatusBadge(loan.status)}</td>

                                        <td>
                                            <div className="action-box">
                                                <button
                                                    className="approve"
                                                    onClick={() => approveLoan(loan.loanId)}
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="reject"
                                                    onClick={() => rejectLoan(loan.loanId)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanApproval;
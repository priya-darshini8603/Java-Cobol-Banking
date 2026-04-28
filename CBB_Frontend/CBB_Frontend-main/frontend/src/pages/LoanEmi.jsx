import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, ArrowLeft, UserCircle } from "lucide-react";
import "./TransactionHistory.css";
import { toast } from "react-toastify";

const LoanEmi = () => {

const navigate = useNavigate();
const token = localStorage.getItem("token");

const [loans, setLoans] = useState([]);
const [accounts, setAccounts] = useState([]);
const [selectedAccountId, setSelectedAccountId] = useState("");

const [loading, setLoading] = useState(true);
const [selectedLoan, setSelectedLoan] = useState(null);
const [showPayment, setShowPayment] = useState(false);
const [paymentSuccess, setPaymentSuccess] = useState(false);

// ---------------- MONEY FORMAT ----------------
const formatMoney = (val) =>
Number(val || 0).toLocaleString("en-IN", {
style: "currency",
currency: "INR"
});

// ---------------- LOAD LOANS ----------------
const fetchLoans = async () => {
try {
setLoading(true);
const res = await fetch("http://localhost:8080/api/loans/customer", {
headers: { Authorization: `Bearer ${token}` }
});

if (!res.ok) throw new Error("Failed to load loans");
setLoans(await res.json());

} catch (err) {
toast.error(err.message);
} finally {
setLoading(false);
}
};

useEffect(() => { fetchLoans(); }, []);

// ---------------- LOAD ACCOUNTS ----------------
const fetchAccounts = async () => {
try {
const res = await fetch("http://localhost:8080/accounts/my-accounts", {
headers: { Authorization: `Bearer ${token}` }
});

if (!res.ok) throw new Error("Failed to load accounts");

const data = await res.json();
setAccounts(data);

if (data.length > 0) {
setSelectedAccountId(data[0].accountId);
}

} catch (err) {
toast.error(err.message);
}
};

// ---------------- OPEN PAYMENT ----------------
const handlePayClick = async (loan) => {
setSelectedLoan(loan);
setShowPayment(true);
setPaymentSuccess(false);
await fetchAccounts();
};

// ---------------- PAY EMI ----------------
const handlePayment = async () => {

if (!selectedAccountId) {
toast.error("Please select account");
return;
}

try {
const res = await fetch(
`http://localhost:8080/api/loans/${selectedLoan.loanId}/pay-emi?accountId=${Number(selectedAccountId)}`,
{
method: "POST",
headers: { Authorization: `Bearer ${token}` }
}
);

if (!res.ok) {
const msg = await res.text();
throw new Error(msg);
}

toast.success("EMI paid successfully");
setPaymentSuccess(true);

await fetchLoans();

setTimeout(() => {
setShowPayment(false);
setSelectedLoan(null);
}, 2000);

} catch (err) {
toast.error(err.message);
}
};

return (
<div className="th-container">

    {/* NAVBAR */}
    <nav className="th-nav">
        <div className="th-nav-left">
            <Landmark size={20} />
            <span className="th-brand-name">Bank</span>
        </div>
        <div className="th-nav-right">
            <button className="th-back-btn" onClick={()=> navigate("/user-dashboard")}>
                <ArrowLeft size={16} /> Back
            </button>
            <UserCircle size={32} />
        </div>
    </nav>

    {/* TABLE */}
    <div className="th-content">
        <div className="th-card">
            <div className="th-header">
                <h1 className="th-title">My Loan EMIs</h1>
            </div>

            {loading ? (
            <p>Loading loans...</p>
            ) : (
            <table className="th-table">
                <thead>
                    <tr>
                        <th>Loan ID</th>
                        <th>Principal</th>
                        <th>Interest %</th>
                        <th>Tenure</th>
                        <th>EMI</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map(loan => (
                    <tr key={loan.loanId}>
                        <td>{loan.loanId}</td>
                        <td>{formatMoney(loan.loanAmount)}</td>
                        <td>{loan.annualInterestRate}%</td>
                        <td>{loan.tenureMonths}</td>
                        <td>{formatMoney(loan.emi)}</td>
                        <td>{loan.status}</td>
                        <td>
                            <button disabled={ loan.status !=="APPROVED" || Number(loan.remainingBalance) <=0 }
                                onClick={()=> handlePayClick(loan)}
                                >
                                {Number(loan.remainingBalance) <= 0 ? "Fully Paid" : "Pay EMI" } </button> </td> </tr>
                                    ))} </tbody> </table> )} </div> </div> {/* PAYMENT POPUP */} {showPayment &&
                                    selectedLoan && ( <div className="emi-popup">
                                    <div className="emi-card">

                                        {paymentSuccess ? (
                                        <div className="payment-success-ui">
                                            <div className="success-circle">
                                                <div className="success-check">✓</div>
                                            </div>
                                            <h2>Payment Successful!</h2>
                                        </div>
                                        ) : (
                                        <>
                                            <h2>Pay EMI</h2>

                                            <p><strong>Loan ID:</strong> {selectedLoan.loanId}</p>
                                            <p><strong>Loan Amount:</strong> {formatMoney(selectedLoan.loanAmount)}</p>
                                            <p><strong>Interest Rate:</strong> {selectedLoan.annualInterestRate}%</p>
                                            <p><strong>Total Interest:</strong>
                                                {formatMoney(selectedLoan.totalInterest)}</p>
                                            <p><strong>Total Repayment:</strong>
                                                {formatMoney(selectedLoan.totalRepayment)}</p>
                                            <p><strong>Remaining Balance:</strong>
                                                {formatMoney(selectedLoan.remainingBalance)}</p>
                                            <p><strong>EMI per month:</strong> {formatMoney(selectedLoan.emi)}</p>

                                            <label>Select Account</label>
                                            <select value={selectedAccountId} onChange={(e)=>
                                                setSelectedAccountId(e.target.value)}
                                                >
                                                {accounts.length === 0 && (
                                                <option>No accounts available</option>
                                                )}
                                                {accounts.map(acc => (
                                                <option key={acc.accountId} value={acc.accountId}>
                                                    {acc.accountNumber} — {formatMoney(acc.balance)}
                                                </option>
                                                ))}
                                            </select>

                                            <button onClick={handlePayment} disabled={!accounts.length}>
                                                Pay Now
                                            </button>

                                            <button onClick={()=> setShowPayment(false)}>
                                                Cancel
                                            </button>
                                        </>
                                        )}

                                    </div>
        </div>
        )}
    </div>
    );
    };

    export default LoanEmi;
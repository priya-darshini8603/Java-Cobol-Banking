import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Landmark, ArrowLeft, UserCircle } from "lucide-react";
import "./TransactionHistory.css";

const LoanStatus = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await api.get("api/loans/customer"); 
        setLoans(res.data);
      } catch (err) {
        setError("Failed to load loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
  <div className="th-container">
             {/* NAVBAR */}
             <nav className="th-nav">
                 <div className="th-nav-left">
                     <div className="th-logo-box">
                         <Landmark size={20} color="black" />
                     </div>
                     <span className="th-brand-name">Bank</span>
                 </div>
 
                 <div className="th-nav-right">
                     <button
                         className="th-back-btn"
                         onClick={() => navigate("/user-dashboard")}
                     >
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
              <h1 className="th-title">Loan Application Status</h1>
            </div>

          {loading ? (
            <p>Loading loans...</p>
          ) : error ? (
            <p>{error}</p>
          ) : loans.length === 0 ? (
            <p>No loan applications found.</p>
          ) : (
            <table className="th-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Credit Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loanId}>
                    <td>{loan.loanId}</td>
                    <td>{loan.loanType}</td>
                    <td>₹{loan.loanAmount}</td>
                    <td>{loan.creditScore}</td>
                    <td className={`status ${loan.status.toLowerCase()}`}>
                      {loan.status}
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

export default LoanStatus;

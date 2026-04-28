import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import api from "../services/api";
import "./AdminAnalytics.css";

const COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

const AdminAnalytics = () => {
  const navigate = useNavigate();

  const [loanStats, setLoanStats] = useState([]);
  const [txnStats, setTxnStats] = useState([]);

  useEffect(() => {
    fetchLoanStats();
    fetchTxnStats();
  }, []);

  // ===== LOAN PIE DATA =====
  const fetchLoanStats = async () => {
    try {
      const res = await api.get("/admin/loan-status-stats");

      const data = [
        { name: "Approved", value: res.data.Approved || 0 },
        { name: "Pending", value: res.data.Pending || 0 },
        { name: "Rejected", value: res.data.Rejected || 0 }
      ];

      setLoanStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== BAR DATA =====
  const fetchTxnStats = async () => {
    try {
      const res = await api.get("/admin/monthly-transactions");
      setTxnStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalLoans = loanStats.reduce((a, b) => a + b.value, 0);

  return (
    <div className="analytics-container">

      <div className="analytics-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>Admin Analytics Dashboard</h1>
      </div>

      <div className="charts-grid">

        {/* ===== PIE ===== */}
        <div className="chart-card">
          <h2>Loan Status Distribution</h2>

          <ResponsiveContainer width="100%" height={420}>
            <PieChart>
              <Pie
                data={loanStats}
                cx="50%"
                cy="50%"
                innerRadius={95}
                outerRadius={140}
                paddingAngle={4}
                dataKey="value"
                label
              >
                {loanStats.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />

              <text x="50%" y="48%" textAnchor="middle" className="center-number">
                {totalLoans}
              </text>
              <text x="50%" y="58%" textAnchor="middle" className="center-label">
                Total Loans
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ===== BAR ===== */}
        <div className="chart-card">
          <h2>Monthly Transactions</h2>

          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={txnStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="transactions" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
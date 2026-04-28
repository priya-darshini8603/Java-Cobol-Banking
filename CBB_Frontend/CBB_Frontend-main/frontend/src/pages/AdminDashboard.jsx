import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, FileText, ClipboardList } from 'lucide-react';
import api from "../services/api";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingLoans, setPendingLoans] = useState(0);
  const [todayTxns, setTodayTxns] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setTotalUsers((await api.get("/admin/total-users")).data);
        setTotalRevenue((await api.get("/admin/total-revenue")).data);
        setPendingLoans((await api.get("/admin/pending-loans")).data);
        setTodayTxns((await api.get("/admin/today-transactions")).data);
      } catch (err) {
        console.log("Dashboard load error", err);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const stats = [
    { label: 'Pending Loans', value: pendingLoans, bg: '#FEF3C7', color: '#92400E' },
    { label: 'Total Users', value: totalUsers, bg: '#DBEAFE', color: '#1E40AF' },
    { label: "Today's Transactions", value: todayTxns, bg: '#D1FAE5', color: '#065F46' },
    { label: 'Total Revenue', value: `₹ ${totalRevenue}`, bg: '#F3E8FF', color: '#6B21A8' },
  ];

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <div className="header-left">
          <ShieldCheck size={24} />
          <div>
            <h1>Admin Dashboard</h1>
            <p>System Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <span>{s.label}</span>
            <div style={{ background: s.bg, color: s.color }}>
              <h3>{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="actions-row">

        <div className="admin-action-card" onClick={() => navigate('/loan-approval')}>
          <FileText size={24} />
          <div>
            <h3>Loan Approval</h3>
            <p>Review and approve loan applications</p>
          </div>
        </div>

        <div className="admin-action-card" onClick={() => navigate('/admin-transactions')}>
          <ClipboardList size={24} />
          <div>
            <h3>All Transactions</h3>
            <p>View all user transactions</p>
          </div>
        </div>

        <div className="admin-action-card" onClick={() => navigate('/admin-users')}>
          👥
          <div>
            <h3>Manage Users</h3>
            <p>View and delete users</p>
          </div>
        </div>
        <div
  className="admin-action-card"
  onClick={() => navigate('/admin-analytics')}
>
  📊
  <div>
    <h3>Analytics</h3>
    <p>View system charts & insights</p>
  </div>
</div>

      </div>
    </div>
  );
};

export default AdminDashboard;
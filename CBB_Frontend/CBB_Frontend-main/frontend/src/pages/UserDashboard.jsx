import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut,
    Landmark,
    Plus,
    Banknote,
    Wallet,
    Clock,
    FileText,
    CheckCircle2
} from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();

    // 🚪 LOGOUT
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const actions = [
        {
            icon: <Plus size={24} />,
            title: 'Create Account',
            desc: 'Open a new bank account',
            onClick: () => navigate('/create-account')
        },
        {
            icon: <Banknote size={24} />,
            title: 'Manage Money',
            desc: 'Deposit / Withdraw / Transfer',
            onClick: () => navigate('/deposit-withdraw')
        },
        {
            icon: <Wallet size={24} />,
            title: 'Check Balance',
            desc: 'View account balance',
            onClick: () => navigate('/account-balance')
        },
        {
            icon: <Clock size={24} />,
            title: 'Transaction History',
            desc: 'View past transactions',
            onClick: () => navigate('/transaction-history')
        },
        {
            icon: <FileText size={24} />,
            title: 'Apply for Loan',
            desc: 'Submit a loan application',
            onClick: () => navigate('/loan-application')
        },
        {
            icon: <CheckCircle2 size={24} />,
            title: 'Loan Status',
            desc: 'Check loan application status',
            onClick: () => navigate('/loan-status')
        },
        {
            icon: <Banknote size={24} />,
            title: 'My Loan EMIs',
            desc: 'View EMI amount for all active loans',
            onClick: () => navigate('/loan-emi')
        }
    ];

    return (
        <div className="dashboard-container">

            <header className="dashboard-header">
                <div className="header-left">
                    <div className="header-icon">
                        <Landmark size={24} />
                    </div>
                    <div>
                        <h1>User Dashboard</h1>
                        <p>Welcome back 👋</p>
                    </div>
                </div>

                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <div className="dashboard-content">
                <div className="cards-grid">
                    {actions.map((action, index) => (
                        <div
                            key={index}
                            className="action-card"
                            onClick={action.onClick}
                        >
                            <div className="card-icon">{action.icon}</div>
                            <div>
                                <h3>{action.title}</h3>
                                <p>{action.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default UserDashboard;
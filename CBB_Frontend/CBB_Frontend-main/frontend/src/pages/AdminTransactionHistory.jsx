import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ArrowLeft, UserCircle, Search, RefreshCw } from 'lucide-react';
import api from '../services/api';
import './TransactionHistory.css'; // Reuse existing styles

const AdminTransactionHistory = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/all-transactions');
            setTransactions(res.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to load transactions.");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter transactions based on search
    const filteredTransactions = transactions.filter(txn =>
        txn.txnId.toString().includes(searchTerm) ||
        txn.fromAccount?.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.toAccount?.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUCCESS': return 'status-success';
            case 'PENDING': return 'status-pending';
            case 'FAILED': return 'status-failed';
            default: return '';
        }
    };

    return (
        <div className="th-container">
            {/* Navbar */}
            <nav className="th-nav">
                <div className="th-nav-left">
                    <div className="th-logo-box">
                        <Landmark size={20} color="black" />
                    </div>
                    <span className="th-brand-name">Bank of Modernize (Admin)</span>
                </div>
                <div className="th-nav-right">
                    <button className="th-back-btn" onClick={() => navigate('/admin-dashboard')}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <div className="profile-wrapper">
                        <UserCircle size={32} color="#9CA3AF" />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="th-content">
                <div className="th-card">
                    <div className="th-header" style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
                        <div>
                            <h1 className="th-title">Global Transaction History</h1>
                            <p className="th-subtitle">Monitor all user transactions in real-time</p>
                        </div>
                        <button onClick={fetchTransactions} className="refresh-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <RefreshCw size={20} color="#4B5563" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="search-bar-container" style={{ margin: '20px 0', position: 'relative' }}>
                        <Search className="search-icon" size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                        <input
                            type="text"
                            placeholder="Search by Transaction ID, User, or Status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message" style={{ color: 'red', textAlign: 'center', padding: '10px' }}>
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="th-table-container">
                        {isLoading ? (
                            <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>Loading transactions...</div>
                        ) : (
                            <table className="th-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>From User</th>
                                        <th>To User</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((txn) => (
                                            <tr key={txn.txnId}>
                                                <td>#{txn.txnId}</td>
                                                <td>
                                                    <div className="user-info">
                                                        <span className="user-name">{txn.fromAccount?.customer?.fullName || 'System'}</span>
                                                        <span className="user-email" style={{ fontSize: '12px', color: '#6B7280', display: 'block' }}>{txn.fromAccount?.customer?.email}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {txn.toAccount ? (
                                                        <div className="user-info">
                                                            <span className="user-name">{txn.toAccount?.customer?.fullName}</span>
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#9CA3AF' }}>-</span>
                                                    )}
                                                </td>
                                                <td>{formatDate(txn.createdAt)}</td>
                                                <td>
                                                    <span className={`txn-type-badge ${txn.txnType?.toLowerCase()}`}>
                                                        {txn.txnType}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 'bold', color: txn.txnType === 'DEPOSIT' ? '#16a34a' : (txn.txnType === 'WITHDRAW' ? '#dc2626' : '#2563eb') }}>
                                                    {txn.txnType === 'WITHDRAW' || txn.txnType === 'TRANSFER' ? '-' : '+'}
                                                    {formatCurrency(txn.amount)}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${getStatusColor(txn.status)}`}>
                                                        {txn.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="empty-row">
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No transactions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="th-pagination">
                        <span>Showing {filteredTransactions.length} results</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactionHistory;

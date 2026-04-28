import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import UsersList from "./pages/UsersList";
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupSteps from './pages/SignupSteps';
import ForgotPassword from './pages/ForgotPassword';
import DepositWithdraw from './pages/DepositWithdraw';
import LoanApplication from './pages/LoanApplication';
import LoanEmi from './pages/LoanEmi';
import LoanStatus from './pages/LoanStatus';
import TransactionHistory from './pages/TransactionHistory';
import AccountBalance from './pages/AccountBalance';
import LoanApproval from './pages/LoanApproval';
import AdminTransactionHistory from './pages/AdminTransactionHistory';
import AdminAnalytics from "./pages/AdminAnalytics";

// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children, allowedRole }) => {
  const isAuth = localStorage.getItem('isAuthenticated');
  const role = localStorage.getItem('role');

  if (isAuth !== 'true') {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return (
      <Navigate
        to={role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
        replace
      />
    );
  }

  return children;
};

function App() {
  return (
    <>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/create-account" element={<SignupSteps />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deposit-withdraw"
          element={
            <ProtectedRoute allowedRole="user">
              <DepositWithdraw />
            </ProtectedRoute>
          }
        />

        <Route
          path="/loan-application"
          element={
            <ProtectedRoute allowedRole="user">
              <LoanApplication />
            </ProtectedRoute>
          }
        />

        <Route
          path="/loan-status"
          element={
            <ProtectedRoute allowedRole="user">
              <LoanStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transaction-history"
          element={
            <ProtectedRoute allowedRole="user">
              <TransactionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account-balance"
          element={
            <ProtectedRoute allowedRole="user">
              <AccountBalance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/loan-emi"
          element={
            <ProtectedRoute allowedRole="user">
              <LoanEmi />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <ProtectedRoute allowedRole="admin">
              <UsersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/loan-approval"
          element={
            <ProtectedRoute allowedRole="admin">
              <LoanApproval />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-transactions"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminTransactionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-analytics"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
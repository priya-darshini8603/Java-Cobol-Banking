import API from "./api";
import axios from "axios";

const API_BASE = "http://localhost:8080";

// ===============================
// CREATE ACCOUNT
// ===============================
export const createAccount = (data) => {
  return API.post("/accounts/create", data);   // <-- FIXED endpoint
};

// ===============================
// GET ALL ACCOUNTS (Admin)
// ===============================
export const getAllAccounts = () => {
  return API.get("/accounts");
};

// ===============================
// GET ACCOUNT BY ID
// ===============================
export const getAccountById = (id) => {
  return API.get(`/accounts/${id}`);
};

// ===============================
// FETCH LOGGED-IN USER ACCOUNTS
// ===============================
export const fetchMyAccounts = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await axios.get(`${API_BASE}/accounts/my-accounts`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return res.data;
};
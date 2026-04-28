import axios from "axios";

const API_BASE = "http://localhost:8080";

export const registerUser = async (data) => {
  return axios.post(`${API_BASE}/auth/register`, data);
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API}/login`, {
    email,
    password,
  });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await axios.post(`${API}/verify-otp`, {
    email,
    otp,
  });
  return res.data;
};

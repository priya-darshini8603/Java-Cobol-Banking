import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from 'react-toastify';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/all-users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  // ================= DELETE USER =================
  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8080/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const msg = await res.text();

      if (res.ok) {
        toast.success(msg); 

        // remove user instantly (no refresh)
        setUsers((prev) => prev.filter((u) => u.userId !== id));
      } else {
        toast.error(msg || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while deleting");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>👥 Manage Users</h2>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Back
          </button>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: 20, textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.userId} style={styles.row}>
                  <td style={styles.td}>{u.userId}</td>
                  <td style={styles.td}>{u.fullName}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.phone}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.roleBadge,
                        background:
                          u.role === "ADMIN" ? "#fee2e2" : "#e0f2fe",
                        color: u.role === "ADMIN" ? "#b91c1c" : "#0369a1",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteUser(u.userId, u.fullName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;


const styles = {
  page: {
    background: "#f4f6f9",
    minHeight: "100vh",
    padding: "30px",
  },

  container: {
    maxWidth: "1100px",
    margin: "auto",
    background: "white",
    padding: "20px 25px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  backBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },

  thead: {
    background: "#1e40af",
    color: "white",
  },

  th: {
    padding: "14px 18px",
    textAlign: "left",
    fontSize: "14px",
  },

  td: {
    padding: "14px 18px",
    background: "white",
    fontSize: "14px",
  },

  row: {
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    borderRadius: "6px",
  },

  roleBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
};
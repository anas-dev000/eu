import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, admins: 0, regular: 0 });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = res.data.users || [];
        setUsers(list);
        setStats({
          total: list.length,
          verified: list.filter((u) => u.isVerified).length,
          admins: list.filter((u) => u.role === "admin").length,
          regular: list.filter((u) => u.role === "user").length,
        });
      } catch {
        // Silently fail if endpoint not ready yet
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="dashboard-container">
          {/* Welcome header */}
          <motion.div
            className="dashboard-welcome dashboard-welcome--admin"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="dashboard-welcome__text">
              <h1>لوحة التحكم — أخصائي</h1>
              <p className="dashboard-welcome__email">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="dashboard-logout-btn" id="admin-logout">
              تسجيل الخروج
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="admin-stats-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="admin-stat">
              <span className="admin-stat__value">{stats.total}</span>
              <span className="admin-stat__label">إجمالي المستخدمين</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__value">{stats.verified}</span>
              <span className="admin-stat__label">مفعّلين</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__value">{stats.admins}</span>
              <span className="admin-stat__label">أخصائيين</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__value">{stats.regular}</span>
              <span className="admin-stat__label">مستخدمين</span>
            </div>
          </motion.div>

          {/* Users table */}
          <motion.section
            className="dashboard-section"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="dashboard-section__title">قائمة المستخدمين</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>البريد الإلكتروني</th>
                    <th>الدور</th>
                    <th>الحالة</th>
                    <th>تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td dir="ltr" style={{ textAlign: "left" }}>{u.email}</td>
                        <td>
                          <span className={`admin-role-badge admin-role-badge--${u.role}`}>
                            {u.role === "admin" ? "أخصائي" : "مستخدم"}
                          </span>
                        </td>
                        <td>
                          <span className={`admin-status-dot ${u.isVerified ? "admin-status-dot--active" : "admin-status-dot--pending"}`} />
                          {u.isVerified ? "مفعّل" : "غير مفعّل"}
                        </td>
                        <td dir="ltr" style={{ textAlign: "left" }}>
                          {new Date(u.createdAt).toLocaleDateString("ar-SA")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "var(--color-ink-muted)" }}>
                        لا توجد بيانات متاحة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

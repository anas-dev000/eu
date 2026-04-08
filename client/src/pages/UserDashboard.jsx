import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const quickLinks = [
    { to: "/blog", label: "المدونة", icon: "📝" },
    { to: "/communication", label: "التواصل", icon: "💬" },
    { to: "/podcasts", label: "البودكاست", icon: "🎙️" },
    { to: "/stories", label: "القصص", icon: "📖" },
    { to: "/sessions", label: "الجلسات", icon: "🗓️" },
    { to: "/games", label: "الألعاب", icon: "🎮" },
    { to: "/interaction", label: "التفاعل", icon: "🤝" },
  ];

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="dashboard-container">
          {/* Welcome header */}
          <motion.div
            className="dashboard-welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="dashboard-welcome__text">
              <h1>مرحباً بك 👋</h1>
              <p className="dashboard-welcome__email">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="dashboard-logout-btn" id="user-logout">
              تسجيل الخروج
            </button>
          </motion.div>

          {/* Quick links */}
          <motion.section
            className="dashboard-section"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="dashboard-section__title">الوصول السريع</h2>
            <div className="dashboard-quick-grid">
              {quickLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Link to={link.to} className="dashboard-quick-item">
                    <span className="dashboard-quick-item__icon">{link.icon}</span>
                    <span className="dashboard-quick-item__label">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;

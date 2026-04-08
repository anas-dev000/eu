import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar } from "lucide-react";

const STATUS_AR = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  rejected: "مرفوض",
  cancelled_by_user: "ملغاة",
  cancelled_by_specialist: "ملغاة",
};

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;
    axios
      .get("/api/sessions/my-bookings", { headers: { Authorization: `Bearer ${t}` } })
      .then((res) => setBookings(res.data.bookings || []))
      .catch(() => setBookings([]));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="page-shell sess-user-shell">
      <Navbar />
      <main className="page-main">
        <motion.header
          className="sess-user-header"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="sess-user-header__title">مرحباً</h1>
            <p className="sess-user-header__email" dir="ltr">
              {user?.email}
            </p>
          </div>
          <button type="button" className="sess-btn sess-btn--ghost" onClick={handleLogout}>
            تسجيل الخروج
          </button>
        </motion.header>

        <motion.section
          className="sess-user-section"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h2 className="sess-user-section__title">
            <Calendar size={20} className="inline ml-2" />
            جلساتي القادمة
          </h2>
          {bookings.filter((b) => b.status === "pending" || b.status === "confirmed").length === 0 ? (
            <p className="sess-muted">
              لا توجد جلسات نشطة.{" "}
              <Link to="/sessions" className="sess-link">
                احجز موعداً
              </Link>
            </p>
          ) : (
            <ul className="sess-user-bookings">
              {bookings
                .filter((b) => b.status === "pending" || b.status === "confirmed")
                .slice(0, 4)
                .map((b) => (
                  <li key={b._id} className="sess-user-booking-row">
                    <span className={`sess-pill sess-pill--${b.status}`}>{STATUS_AR[b.status]}</span>
                    <span>
                      {new Date(b.startAt).toLocaleString("ar-EG", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      — {b.patientFullName}
                    </span>
                  </li>
                ))}
            </ul>
          )}
          <Link to="/sessions" className="sess-btn sess-btn--primary sess-btn--sm mt-3 inline-block">
            إدارة الجلسات والمحادثة
          </Link>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;

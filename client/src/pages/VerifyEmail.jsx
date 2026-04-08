import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`/api/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "رابط غير صالح أو منتهي الصلاحية");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-bg-shape auth-bg-shape--1" />
      <div className="auth-bg-shape auth-bg-shape--2" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-verify-content">
          {status === "loading" && (
            <>
              <div className="auth-spinner" />
              <p className="auth-verify-text">جاري التحقق من بريدك الإلكتروني...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="auth-verify-icon auth-verify-icon--success">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="auth-verify-title">تم التحقق بنجاح!</h2>
              <p className="auth-verify-text">{message}</p>
              <Link to="/login" className="auth-btn" style={{ display: "inline-block", textAlign: "center", marginTop: "1.5rem" }}>
                تسجيل الدخول
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="auth-verify-icon auth-verify-icon--error">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h2 className="auth-verify-title">فشل التحقق</h2>
              <p className="auth-verify-text">{message}</p>
              <Link to="/register" className="auth-btn" style={{ display: "inline-block", textAlign: "center", marginTop: "1.5rem" }}>
                إعادة التسجيل
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

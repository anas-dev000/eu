import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const LoginModal = () => {
  const { loginModalOpen, closeLoginModal, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (!loginModalOpen) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => emailRef.current?.focus(), 100);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [loginModalOpen]);

  useEffect(() => {
    if (!loginModalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLoginModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loginModalOpen, closeLoginModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      closeLoginModal();
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    closeLoginModal();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {loginModalOpen && (
        <motion.div
          className="auth-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className="auth-modal-card"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="auth-modal__close"
              onClick={handleClose}
              aria-label="إغلاق"
            >
              ×
            </button>
            <div className="auth-modal__header">
              <h2 id="auth-modal-title" className="auth-modal__title">
                تسجيل الدخول
              </h2>
              <p className="auth-modal__subtitle">أدخل بياناتك للوصول إلى حسابك</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form auth-form--modal">
              {error && (
                <div className="auth-alert auth-alert--error">
                  <span>{error}</span>
                </div>
              )}
              <div className="auth-field">
                <label htmlFor="login-modal-email" className="auth-label">
                  البريد الإلكتروني
                </label>
                <input
                  ref={emailRef}
                  id="login-modal-email"
                  type="email"
                  className="auth-input"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="login-modal-password" className="auth-label">
                  كلمة المرور
                </label>
                <input
                  id="login-modal-password"
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "جاري الدخول..." : "دخول"}
              </button>
            </form>
            <div className="auth-modal__footer">
              <Link to="/register" className="auth-card__link" onClick={handleClose}>
                ليس لديك حساب؟ سجّل الآن
              </Link>
              <Link to="/forgot-password" className="auth-card__link" onClick={handleClose}>
                نسيت كلمة المرور؟
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LoginModal;

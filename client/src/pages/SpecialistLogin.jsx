import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthFormWrapper from "../components/AuthFormWrapper";

const SpecialistLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginSpecialist } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginSpecialist(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="تسجيل دخول الأخصائيين"
      subtitle="لوحة التحكم مخصصة للحسابات المعتمدة من الإدارة"
      footerLinks={[{ to: "/login", label: "تسجيل دخول المستخدمين" }]}
    >
      <form onSubmit={handleSubmit} className="auth-form" id="specialist-login-form">
        {error && (
          <div className="auth-alert auth-alert--error">
            <span>{error}</span>
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="specialist-login-email" className="auth-label">
            البريد الإلكتروني
          </label>
          <input
            id="specialist-login-email"
            type="email"
            className="auth-input"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="specialist-login-password" className="auth-label">
            كلمة المرور
          </label>
          <input
            id="specialist-login-password"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
          id="specialist-login-submit"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </AuthFormWrapper>
  );
};

export default SpecialistLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthFormWrapper from "../components/AuthFormWrapper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="تسجيل الدخول"
      subtitle="أدخل بياناتك للوصول إلى حسابك"
      footerLinks={[
        { to: "/register", label: "ليس لديك حساب؟ سجّل الآن" },
        { to: "/forgot-password", label: "نسيت كلمة المرور؟" },
      ]}
    >
      <form onSubmit={handleSubmit} className="auth-form" id="login-form">
        {error && (
          <div className="auth-alert auth-alert--error">
            <span>{error}</span>
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="login-email" className="auth-label">
            البريد الإلكتروني
          </label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className="auth-label">
            كلمة المرور
          </label>
          <input
            id="login-password"
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
          id="login-submit"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </AuthFormWrapper>
  );
};

export default Login;

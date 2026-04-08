import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthFormWrapper from "../components/AuthFormWrapper";

const VerifyCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyWithCode } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromReg = location.state?.email;
    if (fromReg) setEmail(String(fromReg).toLowerCase().trim());
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await verifyWithCode(email.trim().toLowerCase(), code.replace(/\s/g, ""));
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "تعذر التحقق من الرمز");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="تفعيل الحساب"
      subtitle="أدخل الرمز المكوّن من 6 أرقام المرسل إلى بريدك"
      footerLinks={[
        { to: "/register", label: "لم تسجّل بعد؟ إنشاء حساب" },
        { to: "/login", label: "العودة لتسجيل الدخول" },
      ]}
    >
      <form onSubmit={handleSubmit} className="auth-form" id="verify-code-form">
        {error && (
          <div className="auth-alert auth-alert--error">
            <span>{error}</span>
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="verify-email" className="auth-label">
            البريد الإلكتروني
          </label>
          <input
            id="verify-email"
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
          <label htmlFor="verify-code" className="auth-label">
            رمز التفعيل
          </label>
          <input
            id="verify-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            className="auth-input"
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            dir="ltr"
            autoComplete="one-time-code"
            style={{ letterSpacing: "0.35em", fontSize: "1.25rem", textAlign: "center" }}
          />
        </div>

        <button type="submit" className="auth-btn" disabled={loading} id="verify-code-submit">
          {loading ? "جاري التحقق..." : "تفعيل والدخول"}
        </button>
      </form>
    </AuthFormWrapper>
  );
};

export default VerifyCode;

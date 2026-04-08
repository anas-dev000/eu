import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthFormWrapper from "../components/AuthFormWrapper";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="نسيت كلمة المرور"
      subtitle="أدخل بريدك الإلكتروني لإرسال رابط الاستعادة"
      footerLinks={[
        { to: "/login", label: "العودة إلى تسجيل الدخول" },
      ]}
    >
      <form onSubmit={handleSubmit} className="auth-form" id="forgot-form">
        {error && (
          <div className="auth-alert auth-alert--error">
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="auth-alert auth-alert--success">
            <span>{success}</span>
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="forgot-email" className="auth-label">
            البريد الإلكتروني
          </label>
          <input
            id="forgot-email"
            type="email"
            className="auth-input"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
          id="forgot-submit"
        >
          {loading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
        </button>
      </form>
    </AuthFormWrapper>
  );
};

export default ForgotPassword;

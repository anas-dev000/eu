import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthFormWrapper from "../components/AuthFormWrapper";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, "admin");
      setSuccess("تم التسجيل بنجاح! تحقق من بريدك الإلكتروني لتفعيل الحساب.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="تسجيل أخصائي"
      subtitle="أنشئ حساب أخصائي للوصول إلى لوحة التحكم"
      footerLinks={[
        { to: "/login", label: "لديك حساب بالفعل؟ سجّل الدخول" },
      ]}
    >
      <form onSubmit={handleSubmit} className="auth-form" id="admin-register-form">
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
          <label htmlFor="admin-register-email" className="auth-label">
            البريد الإلكتروني
          </label>
          <input
            id="admin-register-email"
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
          <label htmlFor="admin-register-password" className="auth-label">
            كلمة المرور
          </label>
          <input
            id="admin-register-password"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="admin-register-confirm" className="auth-label">
            تأكيد كلمة المرور
          </label>
          <input
            id="admin-register-confirm"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
          id="admin-register-submit"
        >
          {loading ? "جاري التسجيل..." : "إنشاء حساب أخصائي"}
        </button>
      </form>
    </AuthFormWrapper>
  );
};

export default AdminRegister;

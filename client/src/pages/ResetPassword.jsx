import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthFormWrapper from "../components/AuthFormWrapper";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (newPassword.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess("تم تغيير كلمة المرور بنجاح!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "رابط غير صالح أو منتهي الصلاحية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="إعادة تعيين كلمة المرور"
      subtitle="أدخل كلمة المرور الجديدة"
      footerLinks={[
        { to: "/login", label: "العودة إلى تسجيل الدخول" },
      ]}
    >
      <form onSubmit={handleSubmit} className="auth-form" id="reset-form">
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
          <label htmlFor="reset-password" className="auth-label">
            كلمة المرور الجديدة
          </label>
          <input
            id="reset-password"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            dir="ltr"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="reset-confirm" className="auth-label">
            تأكيد كلمة المرور
          </label>
          <input
            id="reset-confirm"
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
          id="reset-submit"
        >
          {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
        </button>
      </form>
    </AuthFormWrapper>
  );
};

export default ResetPassword;

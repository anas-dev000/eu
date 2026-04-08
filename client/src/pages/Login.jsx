import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * المسار `/login` يبقى للروابط القديمة والبريد: يفتح مودال الدخول ثم يُعيد التوجيه للرئيسية.
 * واجهة النموذج الفعلية في `components/LoginModal.jsx` (تُعرض من `App` داخل `AuthProvider`).
 */
const Login = () => {
  const { openLoginModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    openLoginModal();
    navigate("/", { replace: true });
  }, [openLoginModal, navigate]);

  return null;
};

export default Login;

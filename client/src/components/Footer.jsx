import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-ink)] text-white mt-auto">
      <div className="container-content py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Logo className="h-8 w-auto mb-4" />
            <p className="text-sm text-gray-300 leading-relaxed">
              منصة تعليمية وتفاعلية لدعم الأطفال ذوي اضطراب طيف التوحد وأسرهم.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">روابط سريعة</h4>
            <nav className="flex flex-col gap-2">
              {[
                { to: "/", label: "الرئيسية" },
                { to: "/blog", label: "المدونة" },
                { to: "/about", label: "من نحن" },
                { to: "/games", label: "الألعاب" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-gray-300 hover:text-[var(--color-apricot)] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">تواصل معنا</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              نسعد بتواصلكم واقتراحاتكم لتطوير المنصة.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} مُبدع — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

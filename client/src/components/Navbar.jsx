import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "./Logo";

const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/blog", label: "المدونة" },
  { to: "/communication", label: "التواصل" },
  { to: "/podcasts", label: "البودكاست" },
  { to: "/about", label: "من نحن" },
  { to: "/stories", label: "القصص" },
  { to: "/sessions", label: "الجلسات" },
  { to: "/games", label: "الألعاب" },
  { to: "/interaction", label: "التفاعل" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 glass border-b border-soft">
        <div className="container-content relative flex items-center h-12 md:h-16 lg:h-18">
          {/* Logo Side - Occupies space to allow centering the middle part */}
          <div className="flex-shrink-0 w-40">
            <Link
              to="/"
              className="inline-block group"
              title="الانتقال إلى الصفحة الرئيسية"
            >
              <Logo className="h-8 md:h-10 lg:h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
            </Link>
          </div>

          {/* Desktop Navigation - Absolute Centered or Flex Centered */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-3 py-2 rounded-[var(--radius-md)] text-xs xl:text-sm font-bold
                    transition-all duration-300 whitespace-nowrap
                    ${isActive
                      ? "bg-[var(--color-sky-calm)] text-white shadow-sm"
                      : "text-[var(--color-ink)] hover:bg-[var(--color-sky-calm-light)] hover:text-[var(--color-sky-calm-dark)]"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Toggle / Balance space on the left */}
          <div className="flex flex-1 lg:flex-none justify-end lg:w-40">
            <button
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-cloud-dark)] transition-all duration-300"
              onClick={toggleMenu}
              aria-label="فتح القائمة"
              aria-expanded={isOpen}
            >
              <motion.span
                className="block w-5 h-0.5 bg-[var(--color-ink)] rounded-full origin-center"
                animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-5 h-0.5 bg-[var(--color-ink)] rounded-full"
                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-5 h-0.5 bg-[var(--color-ink)] rounded-full origin-center"
                animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
            />

            {/* Sidebar Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-72 max-w-[80vw] z-50 lg:hidden glass bg-white/95 shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="p-6">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between mb-8">
                  <Logo className="h-8 w-auto" />
                  <button
                    onClick={closeMenu}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-cloud-dark)] transition-colors"
                    aria-label="إغلاق القائمة"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Link
                          to={link.to}
                          onClick={closeMenu}
                          className={`
                            block px-4 py-3 rounded-[var(--radius-md)] text-sm font-semibold
                            transition-all duration-300
                            ${isActive
                              ? "bg-[var(--color-sky-calm)] text-white"
                              : "text-[var(--color-ink)] hover:bg-[var(--color-cloud-dark)]"
                            }
                          `}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

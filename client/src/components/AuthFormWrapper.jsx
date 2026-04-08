import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AuthFormWrapper = ({ children, title, subtitle, footerLinks }) => {
  return (
    <div className="auth-page">
      {/* Decorative background shapes */}
      <div className="auth-bg-shape auth-bg-shape--1" />
      <div className="auth-bg-shape auth-bg-shape--2" />
      <div className="auth-bg-shape auth-bg-shape--3" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <div className="auth-card__header">
          <h1 className="auth-card__title">{title}</h1>
          {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
        </div>

        {/* Form body */}
        <div className="auth-card__body">{children}</div>

        {/* Footer links */}
        {footerLinks && (
          <div className="auth-card__footer">
            {footerLinks.map((link, i) => (
              <Link key={i} to={link.to} className="auth-card__link">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthFormWrapper;

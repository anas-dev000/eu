import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Layout wrapper — provides the shared page shell:
 * Navbar + scrollable main + Footer + auto scroll-to-top.
 */
const Layout = ({ children, className = "" }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <main className={`page-main ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

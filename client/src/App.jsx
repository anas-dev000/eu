import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import LoginModal from "./components/LoginModal";

// Public pages
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Communication from "./pages/Communication";
import Sessions from "./pages/Sessions";
import Podcasts from "./pages/Podcasts";
import Games from "./pages/Games";
import Interaction from "./pages/Interaction";
import Stories from "./pages/Stories";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import SpecialistLogin from "./pages/SpecialistLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyCode from "./pages/VerifyCode";

// Dashboards
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <LoginModal />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/games" element={<Games />} />
          <Route path="/interaction" element={<Interaction />} />
          <Route path="/stories" element={<Stories />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/specialist/login" element={<SpecialistLogin />} />
          <Route path="/admin" element={<Navigate to="/specialist/login" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/verify-email/:token" element={<Navigate to="/verify-code" replace />} />

          {/* Protected: User */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth allowedRoles={["user"]}>
                <UserDashboard />
              </RequireAuth>
            }
          />

          {/* Protected: Admin (Specialist) */}
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth allowedRoles={["admin"]} loginPath="/specialist/login">
                <AdminDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

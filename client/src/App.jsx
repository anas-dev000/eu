import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

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
import AdminRegister from "./pages/AdminRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Dashboards
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <Router>
      <AuthProvider>
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
          <Route path="/admin" element={<AdminRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

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
              <RequireAuth allowedRoles={["admin"]}>
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

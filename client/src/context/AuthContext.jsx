import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user from stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    // Fetch user info
    const meRes = await axios.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${res.data.token}` },
    });
    setUser(meRes.data.user);
    return meRes.data.user;
  };

  const register = async (email, password, role = "user") => {
    const res = await axios.post("/api/auth/register", { email, password, role });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const forgotPassword = async (email) => {
    const res = await axios.post("/api/auth/forgot-password", { email });
    return res.data;
  };

  const resetPassword = async (token, newPassword) => {
    const res = await axios.post("/api/auth/reset-password", { token, newPassword });
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
